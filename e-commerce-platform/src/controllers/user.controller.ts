import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
// }
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Assuming `IUser` is your User interface or type
    }
  }
}
const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getProfile, updateProfile };
