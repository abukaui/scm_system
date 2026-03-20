import express from "express";
import { login, registerStudent, forgotPassword, resetPassword } from "../controllers/studentController";

const route = express.Router();

route.post('/register', registerStudent)
route.post('/login', login)
route.post('/forgot-password', forgotPassword)
route.post('/reset-password/:id/:token', resetPassword)

export default route;
