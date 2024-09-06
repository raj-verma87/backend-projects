import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';

interface AuthRequest extends Request {
  user?: IUser;
}

const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default authorize;
