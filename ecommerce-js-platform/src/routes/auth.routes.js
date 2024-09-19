const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');
const validator = require('validator');
const { loginLimiter } = require('../middlewares/rateLimit.middleware');

const router = Router();

// Middleware to validate registration data
const validateRegistration = (req, res, next) => {
    const { email, password, username } = req.body;
    const errors = [];
  
    // Validate email
    if (!email || !validator.isEmail(email)) {
      errors.push('Invalid email address.');
    }
  
    // Validate username (e.g., minimum length of 3)
    if (!username || !validator.isLength(username, { min: 3 })) {
      errors.push('Username must be at least 3 characters long.');
    }
  
    // Validate password (e.g., minimum length of 6)
    if (!password || !validator.isLength(password, { min: 6 })) {
      errors.push('Password must be at least 6 characters long.');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    next(); // Proceed to the next middleware or controller
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
// Apply rate limiting only to the login route
router.post('/login', loginLimiter, login);

module.exports = router;
