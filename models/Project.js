// backend/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  panOrGst: { type: String, enum: ['PAN', 'GST'], required: true },
  idNumber: { type: String, required: true },
  projectType: { type: String, required: true },
  productNames: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  estimatedCost: { type: Number, required: true }, // in lacs
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  planPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
