import { User, IUser } from '../models/user';

export class UserService {
  private users: User[] = [];
  private currentId = 1;

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  createUser(name: string, email: string): User {
    const newUser = new User(this.currentId++, name, email);
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, name: string, email: string): User | undefined {
    const user = this.getUserById(id);
    if (user) {
      user.name = name;
      user.email = email;
    }
    return user;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}
