const SuperAdmin = require('../models/SuperAdmin');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- Register (signup) ---
exports.register = async (req, res) => {
  const { name, email, password, mobile, referralCode } = req.body;

  // 1) Prevent reserved emails
  if (
    email === process.env.MASTER_EMAIL ||
    (await SuperAdmin.findOne({ email }))
  ) {
    return res.status(400).json({ message: 'Email not allowed.' });
  }
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'User already registered.' });
  }

  // 2) Resolve referral if provided
  let createdBy = null;
  if (referralCode) {
    const sa = await SuperAdmin.findOne({ referralCode });
    if (!sa) {
      return res.status(400).json({ message: 'Invalid referral code.' });
    }
    createdBy = sa._id;
  }

  // 3) Hash & prepare verification code
  const hashed = await bcrypt.hash(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // 4) Create the user record
  let user;
  try {
    user = await User.create({
      name,
      email,
      password: hashed,
      mobile,
      createdBy,
      isVerified: false,
      verificationCode: code,
      verificationCodeExpiry: expiry,
    });
  } catch (err) {
    console.error('register: failed to create user:', err);
    // If it's a duplicate-key error, the prior check missed it
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already registered.' });
    }
    return res.status(500).json({ message: 'Registration failed.' });
  }

  // 5) Try sending the email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Verification Code',
      html: `<p>Hi ${name}, your verification code is <b>${code}</b>. It expires in 1 hour.</p>`,
    });
  } catch (err) {
    console.error('register: failed to send email, rolling back user:', err);
    // 6) Roll back on email failure
    await User.findByIdAndDelete(user._id);
    return res.status(502).json({
      message: 'Could not send verification email. Please try again later.',
    });
  }

  // 7) All good!
  return res.json({
    message: 'Registered! Verification code sent to your email.',
  });
};

// --- Verify Email ---
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isVerified)
    return res.status(400).json({ message: 'Already verified' });
  if (user.verificationCode !== code) {
    return res.status(400).json({ message: 'Invalid code' });
  }
  if (user.verificationCodeExpiry < new Date()) {
    return res.status(400).json({ message: 'Code expired' });
  }

  // Mark verified & clear code
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  // Issue JWT now that they’re verified
  const token = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token, role: 'user' });
};

// --- Login (with verification check) ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Master...
  if (email === process.env.MASTER_EMAIL) {
    if (password === process.env.MASTER_PASSWORD) {
      const token = jwt.sign({ role: 'master' }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      return res.json({ token, role: 'master' });
    }
    return res.status(401).json({ message: 'Invalid master credentials' });
  }

  // SuperAdmin...
  const sa = await SuperAdmin.findOne({ email });
  if (sa) {
    const ok = await bcrypt.compare(password, sa.password);
    if (!ok)
      return res.status(401).json({ message: 'Invalid superadmin password' });
    const token = jwt.sign(
      { id: sa._id, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ token, role: 'superadmin' });
  }

  // User...
  const user = await User.findOne({ email });
  if (user) {
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid user password' });
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ token, role: 'user' });
  }

  return res.status(404).json({ message: 'User not found' });
};

exports.getProfile = async (req, res) => {
  const { id, role } = req.user;
  if (role === 'master') {
    return res.json({
      role,
      name: process.env.MASTER_NAME,
      email: process.env.MASTER_EMAIL,
      imageUrl: process.env.MASTER_AVATAR_URL,
    });
  }
  if (role === 'superadmin') {
    const sa = await SuperAdmin.findById(id).select('name email avatarUrl');
    return res.json({
      role,
      name: sa.name,
      email: sa.email,
      imageUrl: sa.avatarUrl || '',
    });
  }
  if (role === 'user') {
    // Populate createdBy with only name, branchName & type
    const u = await User.findById(id)
      .select('name email mobile isPaid createdBy')
      .populate('createdBy', 'name branchName type');
    if (!u) return res.status(404).json({ message: 'User not found' });

    // If they were referred by a bank SuperAdmin, expose that
    const bankReferral =
      u.createdBy && u.createdBy.type === 'bank'
        ? { name: u.createdBy.name, branch: u.createdBy.branchName }
        : null;

    return res.json({
      role: 'user',
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      isPaid: u.isPaid,
      bankReferral,
      imageUrl: '',
    });
  }
  return res.status(404).json({ message: 'Profile not found' });
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // avoid leaking existence
    return res.json({
      message: 'If that email is registered, you’ll receive a reset code',
    });
  }

  // generate code + expiry
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = code;
  user.verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your Password Reset Code',
    html: `<p>Your reset code is <b>${code}</b>. It expires in 1 hour.</p>`,
  });

  res.json({
    message: 'If that email is registered, you’ll receive a reset code',
  });
};

/**
 * POST /api/forgot-password/confirm
 * Public: verify code + set new password
 */
exports.resetPasswordPublic = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid request' });

  if (user.verificationCode !== code) {
    return res.status(400).json({ message: 'Invalid code' });
  }
  if (user.verificationCodeExpiry < new Date()) {
    return res.status(400).json({ message: 'Code expired' });
  }

  // update password
  user.password = await bcrypt.hash(newPassword, 10);
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};
