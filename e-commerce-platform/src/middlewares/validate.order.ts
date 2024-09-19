import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateOrder = [
  // Check if 'products' exists and is an array
  body('products').isArray().withMessage('Products must be an array'),

  // Validate each product in the array
  body('products.*.productId').isString().trim().notEmpty().withMessage('Product ID is required'),
  body('products.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than or equal to 1'),
  body('totalAmount')
    .isInt({ min: 0 }).withMessage('Quantity must be an integer greater than or equal to 0'),

  // Handle errors

  // Handle errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
