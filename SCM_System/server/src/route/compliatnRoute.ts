import express from 'express'
import { compliatCreate, getCompliant } from '../controllers/compliantControllers'
import { authMiddleware } from '../middleware/authMiddleware'


const route = express.Router();

route.post('/compliant', authMiddleware, compliatCreate);
route.get('/compliant', authMiddleware, getCompliant)

export default route;