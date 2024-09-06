import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Product from '../models/product.model';

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [{ product: productId, quantity }] });
    } else {
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
      if (productIndex > -1) {
        // If product exists, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If product does not exist, add to cart
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const showCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    let cart = await Cart.findOne({ user: userId });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId);
    await cart.save();
    
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    
    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
