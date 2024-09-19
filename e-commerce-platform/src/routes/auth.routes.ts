import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { body, validationResult } from 'express-validator';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';
import { loginLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Middleware to validate registration data
const validateRegistration = (req:Request, res:Response, next:NextFunction) => {
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
router.post('/register',validateRegistration, register);
// router.post('/register',[
//     // Validate and sanitize inputs using express-validator
//     body('email').isEmail().withMessage('Invalid email').bail().normalizeEmail(),
//     body('name').isLength({ min: 3 }).withMessage('Username too short').bail().trim(),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').bail(),
//   ], register);

// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
// Apply rate limiting only to the login route
router.post('/login',loginLimiter, login);

export default router;
