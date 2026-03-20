"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./db/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function migrateAdmin() {
    try {
        console.log('Creating admins table...');
        await config_1.pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Admins table ready.');
        // Check if a default admin already exists
        const existing = await config_1.pool.query("SELECT id FROM admins WHERE email = 'admin@scm.edu'");
        if (existing.rows.length === 0) {
            const hashedPassword = await bcrypt_1.default.hash('Admin@1234', 10);
            await config_1.pool.query("INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)", ['Super Admin', 'admin@scm.edu', hashedPassword]);
            console.log('Default admin created:');
            console.log('  Email   : admin@scm.edu');
            console.log('  Password: Admin@1234');
        }
        else {
            console.log('Default admin already exists.');
        }
        console.log('\nAdmin migration completed!');
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
migrateAdmin();
