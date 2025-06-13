const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branchName: { type: String },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  referralCode: { type: String, unique: true },
  type: {
    type: String,
    enum: ['bank', 'individual'],
    required: true,
  },
  commission: { type: mongoose.Schema.Types.ObjectId, ref: 'Commission' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
