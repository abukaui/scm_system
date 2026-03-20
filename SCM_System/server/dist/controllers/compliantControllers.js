"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompliant = exports.compliatCreate = void 0;
const config_1 = require("../db/config");
const compliatCreate = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user.id;
        const result = await config_1.pool.query(`
               INSERT INTO complaints (user_id, title, description, category)
               values($1,$2,$3,$4) RETURNING * 

            `, [userId, title, description, category]);
        res.status(201).json({
            message: "compliant created successecfuly",
            compliant: result.rows[0],
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
};
exports.compliatCreate = compliatCreate;
const getCompliant = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await config_1.pool.query("SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC ", [userId]);
        res.json({ compliant: result.rows });
    }
    catch (error) {
        console.log(`error is occured ${error}`);
        res.status(500).json("internal server error");
    }
};
exports.getCompliant = getCompliant;
