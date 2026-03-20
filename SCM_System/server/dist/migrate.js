"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./db/config");
async function migrate() {
    try {
        console.log('Starting migration...');
        // Check if table 'compliants' exists (old name)
        const oldTableCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'compliants'
            )
        `);
        const oldExists = oldTableCheck.rows[0].exists;
        // Check if table 'complaints' exists (new name)
        const newTableCheck = await config_1.pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'complaints'
            )
        `);
        const newExists = newTableCheck.rows[0].exists;
        if (oldExists && !newExists) {
            console.log("Found old 'compliants' table. Migrating...");
            // Rename the table
            await config_1.pool.query(`ALTER TABLE compliants RENAME TO complaints`);
            console.log("Renamed table: compliants -> complaints");
            // Check if 'catagory' column exists, rename it
            const colCheck = await config_1.pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'complaints' AND column_name = 'catagory'
                )
            `);
            if (colCheck.rows[0].exists) {
                await config_1.pool.query(`ALTER TABLE complaints RENAME COLUMN catagory TO category`);
                console.log("Renamed column: catagory -> category");
            }
        }
        else if (!newExists) {
            // Neither table exists — create fresh
            console.log("Creating fresh 'complaints' table...");
            await config_1.pool.query(`
                CREATE TABLE complaints (
                    id SERIAL PRIMARY KEY,
                    studentid INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    category VARCHAR(100) NOT NULL DEFAULT 'Other',
                    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `);
            console.log("Created 'complaints' table with correct schema.");
        }
        else {
            // 'complaints' already exists — just ensure 'category' column is correct
            const colCheck = await config_1.pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'complaints' AND column_name = 'catagory'
                )
            `);
            if (colCheck.rows[0].exists) {
                await config_1.pool.query(`ALTER TABLE complaints RENAME COLUMN catagory TO category`);
                console.log("Renamed column: catagory -> category");
            }
            else {
                console.log("'complaints' table already has correct schema. No changes needed.");
            }
        }
        console.log('\nMigration completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
migrate();
