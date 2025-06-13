const mongoose = require('mongoose');

const CommissionTransactionSchema = new mongoose.Schema({
  superAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  planAmount: { type: Number, required: true }, // e.g. 4999
  commissionPercent: { type: Number, required: true }, // e.g. 15
  commissionAmount: { type: Number, required: true }, // e.g. 749.85
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  'CommissionTransaction',
  CommissionTransactionSchema
);
