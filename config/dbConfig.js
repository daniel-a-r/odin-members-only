import pg from 'pg';

export const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASS}@${process.env.PG_HOST}:${process.env.PG_PORT}/odin_members_only`;

const { Pool } = pg;

export const pool = new Pool({ connectionString });
