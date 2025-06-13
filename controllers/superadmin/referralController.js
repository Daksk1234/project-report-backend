const SuperAdmin = require('../../models/SuperAdmin');

function genReferral() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `RUP${digits}IOO`;
}

exports.getReferral = async (req, res) => {
  try {
    // Look up just the code
    const admin = await SuperAdmin.findById(req.user.id).select('referralCode');
    if (!admin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }
    if (!admin.referralCode) {
      admin.referralCode = genReferral();
      await admin.save();
      // Or simply error:
      // return res.status(404).json({ message: "Referral code not set" });
    }
    return res.json({ referralCode: admin.referralCode });
  } catch (err) {
    console.error('ReferralController#getReferral:', err);
    return res.status(500).json({ error: 'Failed to fetch referral code' });
  }
};
