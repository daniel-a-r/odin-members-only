import { pool } from '../config/dbConfig.js';

const DATE_TIME_FORMAT = 'Mon DD YYYY, HH12:MIPM TZ';

export default {
  insertUser: async (username, password) => {
    await pool.query(
      'INSERT INTO users (username, password, member, admin) VALUES ($1, $2, $3, $4);',
      [username, password, false, false],
    );
  },

  getUserFromUsername: async (username) => {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1;',
      [username],
    );
    return rows[0];
  },

  getUserFromId: async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [
      id,
    ]);
    return rows[0];
  },

  updateUserMembershipFromId: async (id) => {
    await pool.query('UPDATE users SET member = $1 WHERE id = $2;', [true, id]);
  },

  insertMessage: async (subject, content, timestamp, userId) => {
    await pool.query(
      'INSERT INTO messages (subject, content, timestamp, user_id) VALUES ($1, $2, $3, $4);',
      [subject, content, timestamp, userId],
    );
  },

  getAllMessagesAsMember: async () => {
    const query = `
      SELECT users.username AS user, messages.subject, messages.content, TO_CHAR(messages.timestamp, '${DATE_TIME_FORMAT}') AS timestamp, messages.id AS id
      FROM users
      JOIN messages
      ON users.id = messages.user_id;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getAllMessagesAsNonMember: async () => {
    const query = `
      SELECT user_id AS user, subject, content, TO_CHAR(timestamp, '${DATE_TIME_FORMAT}') AS timestamp, id
      FROM messages;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  deleteMessageFromId: async (id) => {
    const query = `
      DELETE FROM messages WHERE id = $1;
    `;
    await pool.query(query, [id]);
  },
};
