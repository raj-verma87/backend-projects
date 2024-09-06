import { Request, Response } from 'express';
import User from '../models/user.model';
import Product from '../models/product.model';

// Get all users
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user by ID
const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product by ID
const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getAllUsers, deleteUser, getAllProducts, deleteProduct };
