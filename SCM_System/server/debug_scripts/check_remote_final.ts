import { Pool } from 'pg';

async function checkRemote() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log('--- REMOTE Database Final Check ---');
        const res = await pool.query('SELECT id, name, email, role FROM users');
        console.log('Users found:', res.rows);
        
        const res2 = await pool.query('SELECT * FROM students');
        console.log('Students legacy found:', res2.rows);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        process.exit(1);
    }
}

checkRemote();
