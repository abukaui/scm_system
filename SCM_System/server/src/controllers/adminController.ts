import { Request, Response } from "express";
import { pool } from "../db/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/** POST /api/admin/login */
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND role = 'admin'", [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }

        const admin = result.rows[0];
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: admin.id, role: "admin" },
            process.env.JWT_SECRET as string,
            { expiresIn: "8h" }
        );

        const { password: _, ...adminData } = admin;
        res.status(200).json({ message: "Login successful", token, admin: adminData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/** GET /api/admin/complaints — get all complaints with student info */
export const getAllComplaints = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id, c.title, c.description, c.category, c.status, c.created_at,
                u.name AS student_name, u.email AS student_email, u."studentID", u.department
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE u.role = 'student'
            ORDER BY c.created_at DESC
        `);
        res.json({ complaints: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/** PATCH /api/admin/complaints/:id/status — update a complaint's status */
export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "In Progress", "Resolved"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status. Must be: Pending, In Progress, or Resolved" });
            return;
        }

        const result = await pool.query(
            "UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Complaint not found" });
            return;
        }

        res.json({ message: "Status updated", complaint: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/** GET /api/admin/students — get all students */
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, department, "studentID", created_at 
             FROM users WHERE role = 'student' ORDER BY created_at DESC`
        );
        res.json({ students: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/** GET /api/admin/complaints/:id — get a single complaint with student info */
export const getComplaintById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                c.id, c.title, c.description, c.category, c.status, c.created_at,
                u.name AS student_name, u.email AS student_email, u."studentID", u.department
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Complaint not found" });
            return;
        }
        res.json({ complaint: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


