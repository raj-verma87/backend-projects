"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userRoutes_1 = require("./routes/userRoutes");
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
app.use('/api', userRoutes_1.default);
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
