import { Request, Response } from 'express';
import Product from '../models/product.model';

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? req.file.path : ''; // Get image from multer

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? req.file.path : ''; // Update image if provided

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, imageUrl, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
