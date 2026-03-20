"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compliantControllers_1 = require("../controllers/compliantControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const route = express_1.default.Router();
route.post('/compliant', authMiddleware_1.authMiddleware, compliantControllers_1.compliatCreate);
route.get('/compliant', authMiddleware_1.authMiddleware, compliantControllers_1.getCompliant);
exports.default = route;
