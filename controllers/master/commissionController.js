// backend/controllers/master/commissionController.js
const Commission = require('../../models/Commission');

exports.getCommissions = async (req, res) => {
  try {
    const list = await Commission.find().sort('grade');
    res.json(list);
  } catch (err) {
    console.error('getCommissions:', err);
    res.status(500).json({ message: 'Failed to load commissions' });
  }
};

exports.createCommission = async (req, res) => {
  try {
    const comm = await Commission.create(req.body);
    res.status(201).json(comm);
  } catch (err) {
    console.error('createCommission:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateCommission = async (req, res) => {
  try {
    const comm = await Commission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!comm) return res.status(404).json({ message: 'Commission not found' });
    res.json(comm);
  } catch (err) {
    console.error('updateCommission:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCommission = async (req, res) => {
  try {
    const comm = await Commission.findByIdAndDelete(req.params.id);
    if (!comm) return res.status(404).json({ message: 'Commission not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteCommission:', err);
    res.status(500).json({ message: 'Failed to delete commission' });
  }
};
