"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const router = express_1.default.Router();
// Auth
router.post("/admin/login", adminController_1.loginAdmin);
// Protected admin routes
router.get("/admin/complaints", adminAuthMiddleware_1.adminAuthMiddleware, adminController_1.getAllComplaints);
router.patch("/admin/complaints/:id/status", adminAuthMiddleware_1.adminAuthMiddleware, adminController_1.updateComplaintStatus);
router.get("/admin/students", adminAuthMiddleware_1.adminAuthMiddleware, adminController_1.getAllStudents);
exports.default = router;
