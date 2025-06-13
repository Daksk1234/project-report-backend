// backend/models/Plan.js
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  minCost: { type: Number, required: true }, // in lacs
  maxCost: { type: Number, required: true }, // in lacs
  price: { type: Number, required: true }, // in your currency
});

module.exports = mongoose.model('Plan', PlanSchema);
