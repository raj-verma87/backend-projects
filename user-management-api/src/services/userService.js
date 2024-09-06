"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var user_1 = require("../models/user");
var UserService = /** @class */ (function () {
    function UserService() {
        this.users = [];
        this.currentId = 1;
    }
    UserService.prototype.getAllUsers = function () {
        return this.users;
    };
    UserService.prototype.getUserById = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    UserService.prototype.createUser = function (name, email) {
        var newUser = new user_1.User(this.currentId++, name, email);
        this.users.push(newUser);
        return newUser;
    };
    UserService.prototype.updateUser = function (id, name, email) {
        var user = this.getUserById(id);
        if (user) {
            user.name = name;
            user.email = email;
        }
        return user;
    };
    UserService.prototype.deleteUser = function (id) {
        var userIndex = this.users.findIndex(function (user) { return user.id === id; });
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    };
    return UserService;
}());
exports.UserService = UserService;
