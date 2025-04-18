import '@dotenvx/dotenvx/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const DROP_TABLES = `
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS users;
`;

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    member BOOLEAN NOT NULL,
    admin BOOLEAN NOT NULL
  );
`;

const CREATE_MESSAGES_TABLE = `
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    subject VARCHAR NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id UUID REFERENCES users
  );
`;

const main = async () => {
  console.log('Creating table...');
  const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: 'odin_members_only',
  });

  await client.connect();
  await client.query(DROP_TABLES);
  await client.query(CREATE_USERS_TABLE);
  await client.query(CREATE_MESSAGES_TABLE);

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PW, 10);
  await client.query(
    'INSERT INTO users (username,  password, member, admin) VALUES ($1, $2, $3, $4)',
    ['danny', hashedPassword, true, true],
  );

  await client.end();
  console.log('Done');
};

main();
