// backend/controllers/user/projectController.js
const Project = require('../../models/Project');
const Plan = require('../../models/Plan');
const Razorpay = require('razorpay');
const User = require('../../models/User');
const SuperAdmin = require('../../models/SuperAdmin');
const CommissionTransaction = require('../../models/CommissionTransaction');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getProjectById = async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    // ensure it belongs to the logged-in user
    if (!proj || proj.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(proj);
  } catch (err) {
    console.error('getProjectById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).populate(
      'plan',
      'name price'
    );
    res.json(projects);
  } catch (err) {
    console.error('getProjects:', err);
    res.status(500).json({ message: 'Failed to load projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const cost = req.body.estimatedCost;
    const plan = await Plan.findOne({
      minCost: { $lte: cost },
      maxCost: { $gte: cost },
    });
    if (!plan)
      return res.status(400).json({ message: 'No plan matches that cost' });

    const proj = await Project.create({
      user: req.user.id,
      ...req.body,
      plan: plan._id,
      planPrice: plan.price,
    });
    res.status(201).json(proj);
  } catch (err) {
    console.error('createProject:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const proj = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    if (proj.isPaid)
      return res.status(403).json({ message: 'Cannot update paid project' });

    const cost = req.body.estimatedCost;
    const plan = await Plan.findOne({
      minCost: { $lte: cost },
      maxCost: { $gte: cost },
    });
    if (!plan)
      return res.status(400).json({ message: 'No plan matches that cost' });

    proj.set({
      ...req.body,
      plan: plan._id,
      planPrice: plan.price,
    });
    await proj.save();
    res.json(proj);
  } catch (err) {
    console.error('updateProject:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const proj = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    if (proj.isPaid)
      return res.status(400).json({ message: 'Project already paid' });

    const receiptId = `rcpt_${req.user.id.slice(-8)}_${Date.now()
      .toString()
      .slice(-6)}`;
    const amount = proj.planPrice * 100; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1,
    });

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('createOrder:', err);
    res.status(500).json({ message: 'Could not create order' });
  }
};

exports.payProject = async (req, res) => {
  try {
    const proj = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isPaid: true },
      { new: true }
    );
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    // load the user to see who referred them
    const user = await User.findById(req.user.id).lean();
    if (user.createdBy) {
      // fetch that SuperAdmin and its commission percent
      const sa = await SuperAdmin.findById(user.createdBy)
        .populate('commission', 'percent')
        .lean();

      if (sa && sa.commission) {
        const planAmt = proj.planPrice;
        const pct = sa.commission.percent;
        const commAmt = parseFloat(((planAmt * pct) / 100).toFixed(2));

        // record the transaction
        await CommissionTransaction.create({
          superAdmin: sa._id,
          user: user._id,
          project: proj._id,
          planAmount: planAmt,
          commissionPercent: pct,
          commissionAmount: commAmt,
        });
      }
    }

    res.json(proj);
  } catch (err) {
    console.error('payProject:', err);
    res.status(500).json({ message: 'Payment update failed' });
  }
};
