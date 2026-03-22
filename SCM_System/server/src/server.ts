import express, { query } from 'express'
import { pool } from './db/config';
import dotenv from "dotenv"
import studentRoute from './route/studentRoute';
import compliantRoute from './route/compliatnRoute'
import adminRoute from './route/adminRoute'
import cors from 'cors';

            dotenv.config();

            const app = express(); 
            const allowedOrigins = [
                'http://localhost:5173',
                'https://scm-system-fawn.vercel.app',
                process.env.FRONTEND_URL,
                process.env.ALLOWED_ORIGIN
            ].filter(Boolean) as string[];

            app.use(cors({
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);
                    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true
            }))
            app.use(express.json())

            const Port = process.env.PORT || 3000;
            app.use('/api' ,studentRoute)
            app.use('/api',compliantRoute)
            app.use('/api',adminRoute)


            app.listen(Port , ()=>{
            console.log('the server is running ');

            })