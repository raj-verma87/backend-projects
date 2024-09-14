import express from 'express';
import { createOrder, updateOrderStatus, getOrderById } from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware'; // Ensure only authenticated users can interact with orders

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Update order status
router.patch('/:orderId', authMiddleware, updateOrderStatus);

// Get order by ID
router.get('/:orderId', authMiddleware, getOrderById);

export default router;