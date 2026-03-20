"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintById = exports.getAllStudents = exports.updateComplaintStatus = exports.getAllComplaints = exports.loginAdmin = void 0;
const config_1 = require("../db/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/** POST /api/admin/login */
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await config_1.pool.query("SELECT * FROM users WHERE email = $1 AND role = 'admin'", [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        const admin = result.rows[0];
        const isValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
        const { password: _, ...adminData } = admin;
        res.status(200).json({ message: "Login successful", token, admin: adminData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.loginAdmin = loginAdmin;
/** GET /api/admin/complaints — get all complaints with student info */
const getAllComplaints = async (req, res) => {
    try {
        const result = await config_1.pool.query(`
            SELECT 
                c.id, c.title, c.description, c.category, c.status, c.created_at,
                u.name AS student_name, u.email AS student_email, u."studentID", u.department
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE u.role = 'student'
            ORDER BY c.created_at DESC
        `);
        res.json({ complaints: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllComplaints = getAllComplaints;
/** PATCH /api/admin/complaints/:id/status — update a complaint's status */
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["Pending", "In Progress", "Resolved"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status. Must be: Pending, In Progress, or Resolved" });
            return;
        }
        const result = await config_1.pool.query("UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Complaint not found" });
            return;
        }
        res.json({ message: "Status updated", complaint: result.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
/** GET /api/admin/students — get all students */
const getAllStudents = async (req, res) => {
    try {
        const result = await config_1.pool.query(`SELECT id, name, email, department, "studentID", created_at 
             FROM users WHERE role = 'student' ORDER BY created_at DESC`);
        res.json({ students: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllStudents = getAllStudents;
/** GET /api/admin/complaints/:id — get a single complaint with student info */
const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await config_1.pool.query(`
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getComplaintById = getComplaintById;
