const express = require('express');
const { createOrder, updateOrderStatus, getOrderById } = require('../controllers/order.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const validateOrder = require('../middlewares/validate.order');

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, validateOrder, createOrder);

// Update order status
router.patch('/:orderId', authMiddleware, updateOrderStatus);

// Get order by ID
router.get('/:orderId', authMiddleware, getOrderById);

module.exports = router;
