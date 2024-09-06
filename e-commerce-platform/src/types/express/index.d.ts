import { IUser } from '../../models/user.model'; // Adjust the path based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Assuming `IUser` is your User interface or type
    }
  }
}
