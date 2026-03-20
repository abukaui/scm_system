import express, { query } from 'express'
import { pool } from './db/config';
import dotenv from "dotenv"
import studentRoute from './route/studentRoute';
import compliantRoute from './route/compliatnRoute'
import adminRoute from './route/adminRoute'
import cors from 'cors';

            dotenv.config();

            const app = express(); 
            app.use(cors({
                origin: process.env.ALLOWED_ORIGIN || '*',
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