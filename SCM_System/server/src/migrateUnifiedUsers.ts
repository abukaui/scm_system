import { pool } from './db/config';

async function migrate() {
    try {
        console.log('Starting Unified User Migration...');

        // 1. Create the new users table
        await pool.query(`
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
        const studentCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'students'
            )
        `);
        if (studentCheck.rows[0].exists) {
            console.log('Migrating data from "students" table...');
            await pool.query(`
                INSERT INTO users (name, email, password, role, "studentID", department, created_at)
                SELECT name, email, password, 'student', "studentID", department, NOW()
                FROM students
                ON CONFLICT (email) DO NOTHING
            `);
            console.log('Students migrated.');
        }

        // 3. Migrate Admins
        const adminCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'admins'
            )
        `);
        if (adminCheck.rows[0].exists) {
            console.log('Migrating data from "admins" table...');
            await pool.query(`
                INSERT INTO users (name, email, password, role, created_at)
                SELECT name, email, password, 'admin', created_at
                FROM admins
                ON CONFLICT (email) DO NOTHING
            `);
            console.log('Admins migrated.');
        }

        // 4. Update Complaints table to use users.id
        // We need to map studentid (from student table) to the new user.id (where role='student')
        const complaintCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'complaints'
            )
        `);
        if (complaintCheck.rows[0].exists) {
            console.log('Updating "complaints" table to link to "users"...');
            
            // Add a temporary mapping column if needed, or just do a direct update if emails match
            // Since we migrated by email, we can match by email.
            
            // First, add a new column for the user reference
            await pool.query(`ALTER TABLE complaints ADD COLUMN IF NOT EXISTS user_id INTEGER`);
            
            // Update the user_id based on matching student email
            // (Assumes students table still exists for joining, or we can use the old studentid to match)
            // If students table is still there:
            await pool.query(`
                UPDATE complaints c
                SET user_id = u.id
                FROM students s
                JOIN users u ON s.email = u.email
                WHERE c.studentid = s.id AND u.role = 'student'
            `);

            // If we want to be safe and students table might be gone later:
            // But right now it's still there.
            
            console.log('Updated complaints with new user_id.');
        }

        console.log('\nMigration successful!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
