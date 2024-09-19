const rateLimit = require('express-rate-limit');

// Global rate limit: Allow 100 requests per 15 minutes from each IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Create a rate limiter specifically for login requests
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 login requests per 10 minutes
  message: 'Too many login attempts, please try again after 10 minutes.'
});

module.exports = { globalLimiter, loginLimiter };
