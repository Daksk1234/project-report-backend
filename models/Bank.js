const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ifsc: { type: String, required: true, unique: true },
  branchName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  stdCode: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bank', BankSchema);
