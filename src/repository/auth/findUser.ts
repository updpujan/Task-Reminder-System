import { pool } from '../../config/databaseConnection.js';

export const userByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email =$1`, [
    email,
  ]);
  return result;
};
