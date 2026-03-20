"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/** Middleware that checks for a valid JWT with role === 'admin' */
const adminAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            res.status(403).json({ message: "Access denied — admin only" });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Admin auth error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
