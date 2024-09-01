"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../models/user");
class UserService {
    constructor() {
        this.users = [];
        this.currentId = 1;
    }
    getAllUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    createUser(name, email) {
        const newUser = new user_1.User(this.currentId++, name, email);
        this.users.push(newUser);
        return newUser;
    }
    updateUser(id, name, email) {
        const user = this.getUserById(id);
        if (user) {
            user.name = name;
            user.email = email;
        }
        return user;
    }
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    }
}
exports.UserService = UserService;
