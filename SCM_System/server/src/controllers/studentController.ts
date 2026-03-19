


import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {pool} from "../db/config"; // Assuming this is your pool location
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../service/emailService";

export const registerStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, department, studentID, password } = req.body;

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert into Database (using the new users table)
        const result = await pool.query(
            'INSERT INTO users(name, email, department, "studentID", password, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, email, department, "studentID", role',
            [name, email, department, studentID, hashedPassword, 'student']
        );

        const newStudent = result.rows[0];

        // 3. Send Welcome Email (async, don't block response)
        sendWelcomeEmail(newStudent.email, newStudent.name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        // 4. Return the result
        res.status(201).json({
            message: 'Student registered successfully',
            student: newStudent
        });

    } catch (error: any) {
        console.error(error);

        // Postgres unique constraint violation code: 23505
        if (error.code === '23505') {
            const field = error.constraint?.includes('email') ? 'Email' : 'Student ID';
            return res.status(409).json({
                message: `${field} is already registered. Please use a different one.`
            });
        }

        res.status(500).json({ message: 'Server error' });
    }
}


export const login = async (req:Request , res:Response)=>{
    try {
        const {email,password} = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1' ,[email]);

          if (userResult.rows.length===0){
              return res.status(404).json({
                message:'User not found'
              })
          }

         const user = userResult.rows[0];
         const isValidPassword = await bcrypt.compare(password, user.password);

         if(!isValidPassword){
            return res.status(401).json({
                message:'invalid credentials'
            })
         }
          
         const token = jwt.sign(
             {id: user.id, role: user.role} ,
             process.env.JWT_SECRET as string,
             {expiresIn:"1h"}
         )

         const { password: _, ...userData } = user;

         res.status(200).json({
            message:'login successful',
            token,
            user: userData
         })

    } catch (error) {
        console.log("error"+error)
        res.status(500).json({
            message:'server error'
        })
    }
}