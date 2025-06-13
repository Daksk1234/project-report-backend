// backend/routes/master/planRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} = require('../../controllers/master/planController');

const router = express.Router();

// master‐only CRUD
router.get('/', authenticate(), getPlans);
router.post('/', authenticate('master'), createPlan);
router.put('/:id', authenticate('master'), updatePlan);
router.delete('/:id', authenticate('master'), deletePlan);

module.exports = router;
