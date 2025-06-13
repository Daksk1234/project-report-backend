// backend/controllers/master/userController.js
const User = require('../../models/User');
const Project = require('../../models/Project');
const mongoose = require('mongoose');

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.params.id })
      .sort('-createdAt')
      .populate('plan', 'name price')
      .select('companyName createdAt plan planPrice')
      .lean();
    res.json(projects);
  } catch (err) {
    console.error('getUserProjects:', err);
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
};

// GET /api/master/users
// Returns all users, populated with their SuperAdmin name
exports.getAllUsers = async (req, res) => {
  try {
    // 1) fetch users (with their SuperAdmin via createdBy)
    const users = await User.find()
      .populate('createdBy', 'name')
      .select('name email mobile createdBy createdAt')
      .lean(); // lean() so we can add new props easily

    // 2) for each user, find their latest paid project & its plan
    const enriched = await Promise.all(
      users.map(async (u) => {
        const proj = await Project.findOne({
          user: u._id,
          isPaid: true,
        })
          .sort({ createdAt: -1 })
          .populate('plan', 'name price')
          .lean();

        return {
          ...u,
          plan: proj?.plan?.name || '—',
          planAmount: proj?.plan?.price != null ? proj.plan.price : '—',
        };
      })
    );

    return res.json(enriched);
  } catch (err) {
    console.error('UserController#getAllUsers:', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// PUT /api/master/users/:id
// Update name, email, mobile
exports.updateUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const update = { name, email, mobile };

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate('createdBy', 'name')
      .select('name email mobile createdBy createdAt');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('UserController#updateUser:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// DELETE /api/master/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('UserController#deleteUser:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
