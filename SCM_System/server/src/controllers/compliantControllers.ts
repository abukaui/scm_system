import { Request, Response } from "express";
import { pool } from "../db/config";

export const compliatCreate = async (req: any, res: Response) => {
    try {
        const { title, description, category } = req.body;

        const userId = req.user.id;
        const result = await pool.query(`
               INSERT INTO complaints (user_id, title, description, category)
               values($1,$2,$3,$4) RETURNING * 

            `, [userId, title, description, category])

        res.status(201).json({
            message: "compliant created successecfuly",
            compliant: result.rows[0],
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const getCompliant = async (req: any, res: Response) => {

    try {
        const userId = req.user.id;

        const result = await pool.query("SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC ", [userId])
        res.json({ compliant: result.rows })


    } catch (error) {
        console.log(`error is occured ${error}`)
        res.status(500).json("internal server error")
    }
}