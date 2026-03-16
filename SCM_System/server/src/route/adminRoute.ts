import express from "express";
import { loginAdmin, getAllComplaints, updateComplaintStatus, getAllStudents } from "../controllers/adminController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

const router = express.Router();

// Auth
router.post("/admin/login", loginAdmin);

// Protected admin routes
router.get("/admin/complaints", adminAuthMiddleware, getAllComplaints);
router.patch("/admin/complaints/:id/status", adminAuthMiddleware, updateComplaintStatus);
router.get("/admin/students", adminAuthMiddleware, getAllStudents);

export default router;
