import { pool } from '../config/databaseConnection.js';

export const tableExists = async () => {
  try {
    //create table if not exists
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now());`);

    await pool.query(`CREATE TABLE IF NOT EXISTS tasks(
            task_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            task_name VARCHAR(100) NOT NULL,
            task_description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            status VARCHAR(10) NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled','disabled')),
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE );`);

    await pool.query(`CREATE TABLE IF NOT EXISTS reminders (
            reminder_id SERIAL PRIMARY KEY,
            task_id INTEGER NOT NULL REFERENCES tasks(task_id),
            reminder_date DATE,
            reminder_time TIME NOT NULL,
            timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
            repeat VARCHAR(20) NOT NULL DEFAULT 'off'
                CHECK (repeat IN (
                    'off',
                    'minute',
                    'hour',
                    'day',
                    'week',
                    'month',
                    'year'
                )),
            next_run_at TIMESTAMPTZ NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
