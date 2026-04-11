import { Pool } from 'pg';

async function finalClear() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log('--- STARTING AGGRESSIVE CLEAR ---');
        
        // 1. Delete all from complaints
        const res1 = await pool.query('DELETE FROM complaints');
        console.log(`Deleted ${res1.rowCount} rows from complaints.`);

        // 2. Delete all from users
        const res2 = await pool.query('DELETE FROM users');
        console.log(`Deleted ${res2.rowCount} rows from users.`);

        // 3. Reset sequences
        await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        console.log('Reset users_id_seq.');

        // 4. Final verify
        const res3 = await pool.query('SELECT COUNT(*) FROM users');
        console.log(`Final count in users: ${res3.rows[0].count}`);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Aggressive clear failed:', error);
        process.exit(1);
    }
}

finalClear();
