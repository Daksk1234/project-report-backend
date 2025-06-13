// backend/routes/bankRoutes.js
const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const { getBanks } = require('../../controllers/superadmin/bankController');

const router = express.Router();
// any logged-in user can fetch banks
router.get('/', authenticate(), getBanks);

module.exports = router;
