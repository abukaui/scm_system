"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./db/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seedAdmin() {
    try {
        const name = 'Abu Mengistu';
        const email = 'abuy3832@gmail.com';
        const password = 'abumengistu8539'; // Updated to new admin password
        console.log(`Seeding admin: ${name} (${email})...`);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Insert into the unified users table
        await config_1.pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) 
            DO UPDATE SET role = 'admin', name = $1
        `, [name, email, hashedPassword, 'admin']);
        console.log('\n✅ Admin user created/updated successfully!');
        console.log(`  Email: ${email}`);
        console.log(`  Temp Password: ${password}`);
        console.log('\nGo to your dashboard and sign in as Admin.');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}
seedAdmin();
