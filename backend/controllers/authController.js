const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new user - Step 1: Create account and generate TOTP
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
      if (userExists.username === username) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already taken' 
        });
      }
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Intentia (${email})`,
      issuer: 'Intentia'
    });

    console.log('🔐 Generated TOTP secret for:', email);

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    console.log('📱 QR Code generated:', qrCodeUrl ? 'SUCCESS' : 'FAILED');
    console.log('QR Code length:', qrCodeUrl ? qrCodeUrl.length : 0);

    // Create user with TOTP secret (but not enabled yet)
    const user = await User.create({ 
      username, 
      email, 
      password,
      phoneNumber,
      totpSecret: secret.base32,
      totpEnabled: false, // Will be enabled after verification
      onboardingCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Account created. Please set up 2FA to continue.',
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        qrCode: qrCodeUrl,
        secret: secret.base32,
        requiresTOTPSetup: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Verify TOTP setup during registration
// @route   POST /api/auth/verify-totp-setup
const verifyTOTPSetup = async (req, res) => {
  try {
    const { userId, totpCode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: totpCode,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid 2FA code. Please try again.' 
      });
    }

    // Enable TOTP
    user.totpEnabled = true;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '2FA setup successful. Please complete onboarding.',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token,
        totpEnabled: true,
        requiresOnboarding: true
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Login user - TOTP always required
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password, totpCode } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // TOTP is ALWAYS required (mandatory for all users)
    if (!user.totpEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Account setup incomplete. Please contact support.'
      });
    }

    // If no TOTP code provided, request it
    if (!totpCode) {
      return res.status(200).json({
        success: true,
        requiresTOTP: true,
        message: 'Please enter your 2FA code from Google Authenticator'
      });
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: totpCode,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid 2FA code' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token,
        totpEnabled: true,
        onboardingCompleted: user.onboardingCompleted,
        requiresOnboarding: !user.onboardingCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Complete onboarding
// @route   POST /api/auth/complete-onboarding
const completeOnboarding = async (req, res) => {
  try {
    const { selectedIntent } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Mark onboarding as complete
    user.onboardingCompleted = true;
    user.selectedIntent = selectedIntent || 'All';
    await user.save();

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        onboardingCompleted: true,
        selectedIntent: user.selectedIntent
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Disable 2FA (Admin/Support only - not for regular users)
// @route   POST /api/auth/disable-2fa
const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    user.totpEnabled = false;
    user.totpSecret = null;
    await user.save();

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Regenerate TOTP (if user lost access to authenticator)
// @route   POST /api/auth/regenerate-totp
const regenerateTOTP = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // Generate new TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Intentia (${user.email})`
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Update secret but disable TOTP until verified
    user.totpSecret = secret.base32;
    user.totpEnabled = false;
    await user.save();

    res.json({
      success: true,
      message: 'New 2FA secret generated. Please scan and verify.',
      data: {
        qrCode: qrCodeUrl,
        secret: secret.base32,
        requiresVerification: true
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  register,
  verifyTOTPSetup,
  login,
  completeOnboarding,
  disable2FA,
  regenerateTOTP
};