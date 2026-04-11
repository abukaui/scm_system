import { Pool } from 'pg';
import bcrypt from 'bcrypt';

async function testRegister() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    const email = 'test' + Date.now() + '@example.com';
    const studentID = 'SID' + Date.now();
    const hashedPassword = await bcrypt.hash('password123', 10);

    try {
        console.log(`Attempting to register user: ${email} with StudentID: ${studentID}`);
        
        const result = await pool.query(
            'INSERT INTO users(name, email, department, "studentID", password, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, email, department, "studentID", role',
            ['Test User', email, 'CS', studentID, hashedPassword, 'student']
        );
        
        console.log('✅ Registration successful! New User ID:', result.rows[0].id);

        // Now try to register with SAME email
        console.log('Attempting to register with SAME email...');
        try {
            await pool.query(
                'INSERT INTO users(name, email, department, "studentID", password, role) VALUES($1, $2, $3, $4, $5, $6)',
                ['Duplicate User', email, 'CS', 'SID_OTHER', hashedPassword, 'student']
            );
        } catch (err: any) {
            console.log('Caught expected error for duplicate email:');
            console.log('  Code:', err.code);
            console.log('  Detail:', err.detail);
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed unexpectedly:', error);
        process.exit(1);
    }
}

testRegister();
