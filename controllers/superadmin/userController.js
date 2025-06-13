const User = require('../../models/User');
const bcrypt = require('bcrypt');

// List users for this superadmin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.user.id }).select(
      '-password'
    );
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      createdBy: req.user.id,
    });
    res.json({ _id: user._id, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update (email and/or password)
exports.updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const update = { email };
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      update,
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!result) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
