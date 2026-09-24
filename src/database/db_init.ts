import { Client } from 'pg';
import databaseConnection from '../config/databaseConnection.js';
import 'dotenv/config';

const dataBaseInit = async () => {
  try {
    const db_name = process.env.DB_DATABASE;

    const client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres', //default db of postgreSQL
    });

    await client.connect();
    await client.query(`CREATE DATABASE ${db_name}`);
    console.log(`Database ${db_name} created`);
    await client.end();
    await databaseConnection();
  } catch (e) {
    console.log(e);
  }
};

export default dataBaseInit;
