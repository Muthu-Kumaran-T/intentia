const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  verifyTOTPSetup,
  login,
  completeOnboarding,
  disable2FA,
  regenerateTOTP
} = require('../controllers/authController');

// Registration with mandatory TOTP
router.post('/register', register);
router.post('/verify-totp-setup', verifyTOTPSetup);

// Login (TOTP always required)
router.post('/login', login);

// Onboarding
router.post('/complete-onboarding', protect, completeOnboarding);

// TOTP management
router.post('/disable-2fa', protect, disable2FA);
router.post('/regenerate-totp', protect, regenerateTOTP);

module.exports = router;