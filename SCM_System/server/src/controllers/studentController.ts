


import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/config"; // Assuming this is your pool location
import jwt from "jsonwebtoken";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../service/emailService";

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


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const user = userResult.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'invalid credentials'
            })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        )

        const { password: _, ...userData } = user;

        res.status(200).json({
            message: 'login successful',
            token,
            user: userData
        })

    } catch (error) {
        console.log("error" + error)
        res.status(500).json({
            message: 'server error'
        })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'No account found with that email address.' });
        }

        const user = userResult.rows[0];
        // Create a JWT unique to this user and their current password
        const secret = process.env.JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user.id
        };
        const token = jwt.sign(payload, secret, { expiresIn: '5m' });

        // Use a frontend route for the reset link
        const resetLink = `http://localhost:5173/reset-password/${user.id}/${token}`;

        await sendPasswordResetEmail(user.email, user.name, resetLink);

        res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired reset link.' });
        }

        const user = userResult.rows[0];
        const secret = process.env.JWT_SECRET + user.password;

        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid or expired reset link.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};