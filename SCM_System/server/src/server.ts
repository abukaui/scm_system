import express, { query } from 'express'
import { pool } from './db/config';
import dotenv from "dotenv"
import studentRoute from './route/studentRoute';
import cors from 'cors';

dotenv.config();

const app = express(); 
app.use(cors())
app.use(express.json())

const Port = 3000;
app.use('/api' ,studentRoute)


app.listen(Port , ()=>{
console.log('the server is running ');

})