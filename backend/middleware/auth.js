const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password -totpSecret');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Middleware to check if onboarding is completed
const requireOnboarding = async (req, res, next) => {
  try {
    if (!req.user.onboardingCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Please complete onboarding first',
        requiresOnboarding: true
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { protect, requireOnboarding };