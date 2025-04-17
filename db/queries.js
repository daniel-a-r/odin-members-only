import { pool } from '../config/dbConfig.js';

const insertUser = async (username, password) => {
  await pool.query(
    'INSERT INTO users (username, password, member, admin) VALUES ($1, $2, $3, $4)',
    [username, password, false, false],
  );
};

const getUserFromUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  return rows[0];
};

const getUserFromId = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

const updateUserMembershipFromId = async (id) => {
  await pool.query('UPDATE users SET member = $1 WHERE id = $2', [true, id]);
};

export default {
  insertUser,
  getUserFromUsername,
  getUserFromId,
  updateUserMembershipFromId,
};
