// backend/routes/superadmin/referralRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const {
  getReferral,
} = require('../../controllers/superadmin/referralController');
const router = express.Router();

router.get('/', authenticate('superadmin'), getReferral);

module.exports = router;
