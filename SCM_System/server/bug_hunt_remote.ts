import { Pool } from 'pg';
import bcrypt from 'bcrypt';

async function bugHunt() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log('--- Database Bug Hunt ---');
        
        // 1. Check current contents
        const res = await pool.query('SELECT COUNT(*) FROM users');
        console.log('Current user count:', res.rows[0].count);

        if (res.rows[0].count > 0) {
            const users = await pool.query('SELECT id, name, email FROM users');
            console.log('Users in DB:', users.rows);
        }

        // 2. Try to register a user
        const testEmail = 'bugtest@example.com';
        const hashedPassword = await bcrypt.hash('password', 10);
        
        try {
            console.log(`Trying to register ${testEmail}...`);
            await pool.query(
                'INSERT INTO users(name, email, department, "studentID", password, role) VALUES($1, $2, $3, $4, $5, $6)',
                ['Bug Hunter', testEmail, 'CS', 'BUG123', hashedPassword, 'student']
            );
            console.log('Successfully registered once.');

            // Try again
            console.log('Trying to register SAME user again...');
            await pool.query(
                'INSERT INTO users(name, email, department, "studentID", password, role) VALUES($1, $2, $3, $4, $5, $6)',
                ['Bug Hunter 2', testEmail, 'CS', 'BUG456', hashedPassword, 'student']
            );
        } catch (err: any) {
            console.log('CAUGHT ERROR:');
            console.log(JSON.stringify(err, null, 2));
            console.log('Error Code:', err.code);
            console.log('Error Detail:', err.detail);
            console.log('Error Constraint:', err.constraint);
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Hunt failed:', error);
        process.exit(1);
    }
}

bugHunt();
