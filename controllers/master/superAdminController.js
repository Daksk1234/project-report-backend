const SuperAdmin = require('../../models/SuperAdmin');
const Commission = require('../../models/Commission');
const bcrypt = require('bcrypt');

function genReferral() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `RUP${digits}IOO`;
}

// GET all
exports.getAllSuperAdmins = async (req, res) => {
  try {
    const admins = await SuperAdmin.find()
      .select('-password')
      .populate('commission', 'name grade percent'); // ← populate commission

    res.json(admins);
  } catch (err) {
    console.error('getAllSuperAdmins error:', err);
    res.status(500).json({ error: 'Failed to fetch Super Admins' });
  }
};

// CREATE
exports.createSuperAdmin = async (req, res) => {
  try {
    // ✅ Pull `type` out of req.body along with the rest
    const {
      name,
      email,
      password,
      branchName,
      address,
      pincode,
      phone,
      type,
      commission: commissionId, // ← here!
    } = req.body;

    // Make sure `type` has a valid value
    if (!['bank', 'individual'].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be 'bank' or 'individual'." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const code = genReferral();

    const comm = await Commission.findById(commissionId);
    if (!comm)
      return res.status(400).json({ message: 'Invalid commission selected' });

    const admin = await SuperAdmin.create({
      name,
      email,
      password: hashed,
      branchName,
      address,
      pincode,
      phone,
      referralCode: code,
      type,
      commission: commissionId, // ← and here!
    });

    // Return only the safe fields
    const { _id, createdAt, referralCode } = admin;
    return res.json({
      _id,
      name,
      email,
      branchName,
      address,
      pincode,
      phone,
      referralCode,
      type,
      commission: commissionId,
      createdAt,
    });
  } catch (err) {
    console.error('createSuperAdmin failed:', err);
    // For debugging, you can temporarily send back err.message:
    return res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateSuperAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      branchName,
      address,
      pincode,
      phone,
      type,
      commission: commissionId, // ← also pull it here
    } = req.body;

    if (type && !['bank', 'individual'].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be 'bank' or 'individual'." });
    }

    const comm = await Commission.findById(commissionId);
    if (!comm)
      return res.status(400).json({ message: 'Invalid commission selected' });

    const update = {
      name,
      email,
      branchName,
      address,
      pincode,
      phone,
      type,
      commission: commissionId, // ← and include it here
    };

    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    const admin = await SuperAdmin.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select('-password');

    if (!admin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    return res.json(admin);
  } catch (err) {
    console.error('updateSuperAdmin failed:', err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteSuperAdmin = async (req, res) => {
  try {
    await SuperAdmin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Super Admin' });
  }
};
