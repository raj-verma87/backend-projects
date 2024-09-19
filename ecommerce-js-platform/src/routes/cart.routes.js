const express = require('express');
const { 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart, 
  showCart 
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Add item to cart
router.post('/add', authMiddleware, addToCart);

// Remove item from cart
router.post('/remove', authMiddleware, removeFromCart);

// Update item quantity
router.post('/update', authMiddleware, updateCartItem);

// Show cart
router.post('/show', authMiddleware, showCart);

// Clear cart
router.post('/clear', authMiddleware, clearCart);

module.exports = router;
