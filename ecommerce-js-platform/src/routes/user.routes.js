const { Router } = require('express');
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
