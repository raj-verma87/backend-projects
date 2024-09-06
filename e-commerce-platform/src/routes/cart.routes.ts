import express from 'express';
import { addToCart, removeFromCart, updateCartItem, clearCart , showCart } from '../controllers/cart.controller';
import authMiddleware  from '../middlewares/auth.middleware';

const router = express.Router();

// Add item to cart
router.post('/add', authMiddleware, addToCart);

// Remove item from cart
router.post('/remove', authMiddleware, removeFromCart);

// Update item quantity
router.post('/update', authMiddleware, updateCartItem);

// Show carts
router.post('/show', authMiddleware, showCart);

// Clear cart
router.post('/clear', authMiddleware, clearCart);

export default router;
