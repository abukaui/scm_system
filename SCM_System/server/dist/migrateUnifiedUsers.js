"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./db/config");
async function migrate() {
    try {
        console.log('Starting Unified User Migration...');
        // 1. Create the new users table
        await config_1.pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'student',
                "studentID" VARCHAR(100),
                department VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Created "users" table.');
        // 2. Migrate Students
        const studentCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'students'
            )
        `);
        if (studentCheck.rows[0].exists) {
            console.log('Migrating data from "students" table...');
            await config_1.pool.query(`
                INSERT INTO users (name, email, password, role, "studentID", department, created_at)
                SELECT name, email, password, 'student', "studentID", department, NOW()
                FROM students
                ON CONFLICT (email) DO NOTHING
            `);
            console.log('Students migrated.');
        }
        // 3. Migrate Admins
        const adminCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'admins'
            )
        `);
        if (adminCheck.rows[0].exists) {
            console.log('Migrating data from "admins" table...');
            await config_1.pool.query(`
                INSERT INTO users (name, email, password, role, created_at)
                SELECT name, email, password, 'admin', created_at
                FROM admins
                ON CONFLICT (email) DO NOTHING
            `);
            console.log('Admins migrated.');
        }
        // 4. Ensure Complaints Table exists and is updated
        console.log('Checking "complaints" table...');
        await config_1.pool.query(`
            CREATE TABLE IF NOT EXISTS complaints (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100) NOT NULL DEFAULT 'Other',
                status VARCHAR(50) NOT NULL DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        // Check for 'catagory' typo and rename if found
        const catagoryCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'complaints' AND column_name = 'catagory'
            )
        `);
        if (catagoryCheck.rows[0].exists) {
            await config_1.pool.query(`ALTER TABLE complaints RENAME COLUMN catagory TO category`);
            console.log('Renamed "catagory" to "category".');
        }
        // Check for 'user_id' column
        const userIdCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'complaints' AND column_name = 'user_id'
            )
        `);
        if (!userIdCheck.rows[0].exists) {
            await config_1.pool.query(`ALTER TABLE complaints ADD COLUMN user_id INTEGER`);
            console.log('Added "user_id" column to complaints.');
        }
        // Migrate link from old students table if it exists
        const studentTableCheck = await config_1.pool.query(`
            SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students')
        `);
        if (studentTableCheck.rows[0].exists) {
            console.log('Updating complaint ownership from legacy student data...');
            await config_1.pool.query(`
                UPDATE complaints c
                SET user_id = u.id
                FROM students s
                JOIN users u ON s.email = u.email
                WHERE c.studentid = s.id AND u.role = 'student' AND c.user_id IS NULL
            `);
        }
        console.log('\nMigration successful!');
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
migrate();
