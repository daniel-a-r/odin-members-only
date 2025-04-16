import '@dotenvx/dotenvx/config';
import pg from 'pg';
import { connectionString } from '../config/dbConfig.js';

const { Client } = pg;

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR
  );
`;

const main = async () => {
  console.log('Creating table...');
  const client = new Client({
    connectionString,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('Done');
};

main();
