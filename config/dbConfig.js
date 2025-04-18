import pg from 'pg';

export const connectionString = process.env.DEV_DB_URL;

const { Pool } = pg;

export const pool = new Pool({ connectionString });
