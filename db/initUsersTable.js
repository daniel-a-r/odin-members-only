import '@dotenvx/dotenvx/config';
import pg from 'pg';
import { connectionString } from '../config/dbConfig.js';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const SQL = `
  DROP TABLE IF EXISTS users;

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR,
    member BOOLEAN,
    admin BOOLEAN
  );
`;

const main = async () => {
  console.log('Creating table...');
  const client = new Client({
    connectionString,
  });

  await client.connect();
  await client.query(SQL);

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PW, 10);
  await client.query(
    'INSERT INTO users (username,  password, member, admin) VALUES ($1, $2, $3, $4)',
    ['danny', hashedPassword, true, true],
  );
  await client.end();
  console.log('Done');
};

main();
