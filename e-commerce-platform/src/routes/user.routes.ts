import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

export default router;
