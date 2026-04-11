import { Pool } from 'pg';

async function checkTriggers() {
    const connectionString = 'postgresql://scmdb_nfeb_user:mtCQhuoBcXMhDQAT6Ch21NtH3VYFY0sV@dpg-d6vdu1ngi27c73euscbg-a.oregon-postgres.render.com/scmdb_nfeb';
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        console.log('--- Checking Triggers on Remote "users" table ---');
        const res = await pool.query(`
            SELECT 
                tgname AS trigger_name,
                tgtype,
                tgenabled,
                tgisinternal
            FROM pg_trigger 
            WHERE tgrelid = 'users'::regclass
        `);
        console.log('Triggers found:', res.rows);

        console.log('--- Checking for any unique indexes (not just constraints) ---');
        const res2 = await pool.query(`
            SELECT
                i.relname as index_name,
                a.attname as column_name,
                ix.indisunique as is_unique
            FROM
                pg_class t,
                pg_class i,
                pg_index ix,
                pg_attribute a
            WHERE
                t.oid = ix.indrelid
                AND i.oid = ix.indexrelid
                AND a.attrelid = t.oid
                AND a.attnum = ANY(ix.indkey)
                AND t.relkind = 'r'
                AND t.relname = 'users'
                AND ix.indisunique = true
        `);
        console.log('Unique indexes found:', res2.rows);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Check failed:', error);
        process.exit(1);
    }
}

checkTriggers();
