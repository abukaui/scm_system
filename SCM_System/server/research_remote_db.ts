import { Pool } from 'pg';

async function researchRemote() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log('--- REMOTE Database Research ---');
        
        // 1. List all tables in public schema
        const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', tablesRes.rows.map(r => r.table_name));

        // 2. Describe users table
        const usersColumns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Users columns:', usersColumns.rows);

        // 3. Check constraints on users
        const constraints = await pool.query("SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'users'::regclass");
        console.log('Users constraints:', constraints.rows);

        // 4. Check for any other users table
        const allUsersTables = await pool.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'users'");
        console.log('All "users" tables across schemas:', allUsersTables.rows);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Research failed:', error);
        process.exit(1);
    }
}

researchRemote();
