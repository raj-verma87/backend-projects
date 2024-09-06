"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var userService_1 = require("../services/userService");
var userService = new userService_1.UserService();
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.getAllUsers = function (req, res) {
        res.json(userService.getAllUsers());
    };
    UserController.getUserById = function (req, res) {
        var user = userService.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send('User not found');
        }
    };
    UserController.createUser = function (req, res) {
        var _a = req.body, name = _a.name, email = _a.email;
        var newUser = userService.createUser(name, email);
        res.status(201).json(newUser);
    };
    UserController.updateUser = function (req, res) {
        var _a = req.body, name = _a.name, email = _a.email;
        var updatedUser = userService.updateUser(parseInt(req.params.id), name, email);
        if (updatedUser) {
            res.json(updatedUser);
        }
        else {
            res.status(404).send('User not found');
        }
    };
    UserController.deleteUser = function (req, res) {
        var success = userService.deleteUser(parseInt(req.params.id));
        if (success) {
            res.status(204).send();
        }
        else {
            res.status(404).send('User not found');
        }
    };
    return UserController;
}());
exports.UserController = UserController;
