import { Request,Response } from "express";
import { pool } from "../db/config";

export const compliatCreate = async (req:any, res: Response)=>{
      try {
              const { title ,description ,catagory} =req.body;
               
              const studentID = req.user.id;
         const result = await pool.query(`
               INSERT INTO compliants(studentid,title,description,catagory)
               values($1,$2,$3,$4) RETURING * 

            `, [studentID,title,description,catagory])
               
            res.status(201).json({
                message:"compliant created successecfuly",
                compliant: result.rows[0],
            })
                 

      } catch (error) {
        console.log(error)
         res.status(500).json({
            success:false,
            message:"internal server error"
         })
      }
}

export const getCompliant = async (req:any , res:Response)=>{

       try {
            const studentID = req.user.id; 

            const result = await pool.query("SELECT * FROM compliants WHERE studentid = $1 ORDER BY created_at DESC " ,[studentID])
            res.json({compliant :  result.rows})


       } catch (error) {
           console.log(`error is occured ${error}`)
           res.status(500).json("internal server error") 
       }
}