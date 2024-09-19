import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateProduct = [
  body('name').isString().trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),
  
  // Middleware with explicit types for req, res, and next
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
