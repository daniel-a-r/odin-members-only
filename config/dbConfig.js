import pg from 'pg';

export const connectionString = process.env.DATABASE_URL;

const { Pool } = pg;

export const pool = new Pool({ connectionString });
