import { pool } from './db/config';

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Add department column if it doesn't exist
        await pool.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS department VARCHAR(255)
        `);
        console.log('Added department column (if not exists)');

        // Add studentID column if it doesn't exist
        await pool.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS "studentID" VARCHAR(255)
        `);
        console.log('Added studentID column (if not exists)');

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
