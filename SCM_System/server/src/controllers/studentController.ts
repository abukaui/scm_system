


import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {pool} from "../db/config"; // Assuming this is your pool location
import jwt from "jsonwebtoken";

export const registerStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, department, studentID, password } = req.body;

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert into Database
        const result = await pool.query(
            'INSERT INTO students(name, email, department, "studentID", password) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, department, "studentID"',
            [name, email, department, studentID, hashedPassword]
        );

        // 3. Return the FIRST row of the result
        res.status(201).json({
            message: 'Student registered successfully',
            student: result.rows[0]
        });

    } catch (error) {
        console.error(error); // Always log the error for debugging!
        res.status(500).json({
            message: 'Server error'
        });
    }
}


export const loginStudent = async (req:Request , res:Response)=>{
    try {
        const {email,password} = req.body;

        const student = await pool.query('SELECT  * FROM students WHERE email = $1' ,[email]);

          if (student.rows.length===0){
              res.status(404).json({
                message:'student is not found'
              })
          }

         const isValidPassword = await bcrypt.compare(password, student.rows[0].password);

         if(!isValidPassword){
            return res.status(401).json({
                message:'invalid credentials'
            })
         }
          
         const token = jwt.sign(
             {id:student.rows[0].id} ,
             process.env.JWT_SECRET as string,
             {expiresIn:"1h"}
         )

         const { password: _, ...studentData } = student.rows[0];

         res.status(200).json({
            message:'login successful',
            token,
            student: studentData
         })

    } catch (error) {
        console.log("error"+error)
        res.status(500).json({
            message:'server error'
        })
    }
}