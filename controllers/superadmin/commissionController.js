const CommissionTransaction = require('../../models/CommissionTransaction');

exports.getTransactions = async (req, res) => {
  try {
    const txns = await CommissionTransaction.find({ superAdmin: req.user.id })
      .sort('-createdAt')
      .populate('project', 'companyName createdAt')
      .lean();
    res.json(txns);
  } catch (err) {
    console.error('getTransactions:', err);
    res.status(500).json({ message: 'Failed to load transactions' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    // fetch all transactions for this superAdmin
    const txns = await CommissionTransaction.find({
      superAdmin: req.user.id,
    }).select('commissionAmount');

    // sum them up
    const total = txns.reduce((sum, t) => sum + t.commissionAmount, 0);

    return res.json({ total });
  } catch (err) {
    console.error('getSummary error:', err);
    return res.status(500).json({ message: 'Failed to load summary' });
  }
};
