import express from "express";
import { login, registerStudent } from "../controllers/studentController";

const route = express.Router();

route.post('/register', registerStudent)
route.post('/login', login)

export default route;
