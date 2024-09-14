import { Request, Response } from 'express';
import Order from '../models/order.model';
import { getIO } from '../socket'; // Socket.io instance for real-time updates

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { user, products, totalAmount } = req.body;

    const newOrder = new Order({
      user,
      products,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order', error });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit the updated status to the client using Socket.io
    const io = getIO();
    io.to(updatedOrder.user.toString()).emit('orderStatusUpdate', {
      message: `Your order status has been updated to ${status}`,
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status', error });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user', '-password');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get order', error });
  }
};
