import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "Abuka@8539",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "student_system"
    });

pool.on('connect', () => {
    console.log('Successfully connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});