import express from "express";
import { loginStudent, registerStudent } from "../controllers/studentController";


const route = express.Router();

route.post('/register',registerStudent)
route.post('/login',loginStudent)

export default route;
