import { pool } from './server/src/db/config';

async function checkData() {
    try {
        const users = await pool.query('SELECT name, email, role FROM users');
        console.log('--- Users ---');
        console.table(users.rows);

        const complaints = await pool.query('SELECT title, status FROM complaints');
        console.log('--- Complaints ---');
        console.table(complaints.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
}

checkData();
