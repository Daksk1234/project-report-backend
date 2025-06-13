const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPasswordPublic,
  getProfile,
  resetPassword,
} = require('../controllers/authController');

// public
router.post('/signup', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/forgot-password/confirm', resetPasswordPublic);

// protected
router.get('/profile', authenticate(), getProfile);

module.exports = router;
