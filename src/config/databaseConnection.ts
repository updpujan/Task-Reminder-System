import { Pool } from 'pg';
//import dataBaseInit from '../database/db_init.js';
import 'dotenv/config';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const databaseConnection = async () => {
  try {
    await pool.query('SELECT 1');
    return 200;
  } catch (err) {
    console.log(`Error: ${err}`);
    return 503;

    //await dataBaseInit();
  }
};

export default databaseConnection;
