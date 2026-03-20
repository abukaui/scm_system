import express from "express";
import { login, registerStudent, forgotPassword, resetPassword, updateProfile } from "../controllers/studentController";
import { authMiddleware } from "../middleware/authMiddleware";

const route = express.Router();

route.post('/register', registerStudent)
route.post('/login', login)
route.post('/forgot-password', forgotPassword)
route.post('/reset-password/:id/:token', resetPassword)
route.put('/profile', authMiddleware, updateProfile)

export default route;
