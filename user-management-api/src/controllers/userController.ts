import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  static getAllUsers(req: Request, res: Response): void {
    res.json(userService.getAllUsers());
  }

  static getUserById(req: Request, res: Response): void {
    const user = userService.getUserById(parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  }

  static createUser(req: Request, res: Response): void {
    const { name, email } = req.body;
    const newUser = userService.createUser(name, email);
    res.status(201).json(newUser);
  }

  static updateUser(req: Request, res: Response): void {
    const { name, email } = req.body;
    const updatedUser = userService.updateUser(parseInt(req.params.id), name, email);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  }

  static deleteUser(req: Request, res: Response): void {
    const success = userService.deleteUser(parseInt(req.params.id));
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).send('User not found');
    }
  }
}
