"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const route = express_1.default.Router();
route.post('/register', studentController_1.registerStudent);
route.post('/login', studentController_1.login);
route.post('/forgot-password', studentController_1.forgotPassword);
route.post('/reset-password/:id/:token', studentController_1.resetPassword);
route.put('/profile', authMiddleware_1.authMiddleware, studentController_1.updateProfile);
exports.default = route;
