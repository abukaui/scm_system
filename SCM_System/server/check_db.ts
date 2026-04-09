import { pool } from './src/db/config';
import fs from 'fs';

async function checkDb() {
    let output = '';
    const log = (msg: string, data?: any) => {
        output += msg + '\n';
        if (data) output += JSON.stringify(data, null, 2) + '\n';
    };

    try {
        log('--- Table Schema (users) ---');
        const schema = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'users';
        `);
        log('Schema:', schema.rows);

        log('--- Constraints (users) ---');
        const constraints = await pool.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE conrelid = 'users'::regclass;
        `);
        log('Constraints:', constraints.rows);

        log('--- Triggers (users) ---');
        const triggers = await pool.query(`
            SELECT tgname, pg_get_triggerdef(oid)
            FROM pg_trigger
            WHERE tgrelid = 'users'::regclass;
        `);
        log('Triggers:', triggers.rows);

        log('--- Indexes (users) ---');
        const indexes = await pool.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'users';
        `);
        log('Indexes:', indexes.rows);

        log('--- All Users (id, name, email, studentID) ---');
        const users = await pool.query(`
            SELECT id, name, email, "studentID" FROM users ORDER BY id;
        `);
        log('Users:', users.rows);

        fs.writeFileSync('db_check_result.txt', output);
        console.log('Results written to db_check_result.txt');

    } catch (err: any) {
        fs.writeFileSync('db_check_result.txt', 'Error: ' + err.message);
        console.error('Error checking DB:', err);
    } finally {
        await pool.end();
    }
}

checkDb();
