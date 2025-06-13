// backend/controllers/bankController.js
const SuperAdmin = require('../../models/SuperAdmin');

exports.getBanks = async (req, res) => {
  try {
    const banks = await SuperAdmin.find({ type: 'bank' }).select(
      '_id name branchName'
    );
    res.json(banks);
  } catch (err) {
    console.error('getBanks failed:', err);
    res.status(500).json({ message: 'Failed to load banks' });
  }
};
