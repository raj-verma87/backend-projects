import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
router.post('/login', login);

export default router;
