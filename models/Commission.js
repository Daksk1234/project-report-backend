// backend/models/Commission.js
const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  percent: { type: Number, required: true }, // e.g. 5 for 5%
});

module.exports = mongoose.model('Commission', CommissionSchema);
