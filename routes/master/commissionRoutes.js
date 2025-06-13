// backend/routes/master/commissionRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getCommissions,
  createCommission,
  updateCommission,
  deleteCommission,
} = require('../../controllers/master/commissionController');

const router = express.Router();
router.use(authenticate('master'));

router.get('/', getCommissions);
router.post('/', createCommission);
router.put('/:id', updateCommission);
router.delete('/:id', deleteCommission);

module.exports = router;
