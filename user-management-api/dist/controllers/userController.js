"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
class UserController {
    static getAllUsers(req, res) {
        res.json(userService.getAllUsers());
    }
    static getUserById(req, res) {
        const user = userService.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    static createUser(req, res) {
        const { name, email } = req.body;
        const newUser = userService.createUser(name, email);
        res.status(201).json(newUser);
    }
    static updateUser(req, res) {
        const { name, email } = req.body;
        const updatedUser = userService.updateUser(parseInt(req.params.id), name, email);
        if (updatedUser) {
            res.json(updatedUser);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    static deleteUser(req, res) {
        const success = userService.deleteUser(parseInt(req.params.id));
        if (success) {
            res.status(204).send();
        }
        else {
            res.status(404).send('User not found');
        }
    }
}
exports.UserController = UserController;
