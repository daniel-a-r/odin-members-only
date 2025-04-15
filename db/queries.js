import pg from 'pg';
import connectionString from '../config/dbConfig.js';

const { Pool } = pg;
const pool = new Pool({ connectionString });

const insertUser = async (username, password) => {
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
    username,
    password,
  ]);
};

export default { insertUser };
