// backend/controllers/master/planController.js
const Plan = require('../../models/Plan');

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort('minCost');
    res.json(plans);
  } catch (err) {
    console.error('getPlans:', err);
    res.status(500).json({ message: 'Failed to load plans' });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    console.error('createPlan:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    console.error('updatePlan:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deletePlan:', err);
    res.status(500).json({ message: 'Failed to delete plan' });
  }
};
