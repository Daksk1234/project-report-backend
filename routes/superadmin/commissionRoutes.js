const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getTransactions,
  getSummary,
} = require('../../controllers/superadmin/commissionController');

const router = express.Router();
router.use(authenticate('superadmin'));

router.get('/transactions', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
