import { pool } from '../../config/databaseConnection.js';

export const getAllUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE role = 'user';");
    if (result.rowCount === 0) {
      return {
        status: 204,
        message: 'request sucess but no users',
      };
    }
    return {
      status: 200,
      message: 'All users retrived sucessfully',
      users: result.rows,
    };
  } catch (err) {
    return {
      status: 503,
      message: 'database service unavalible',
      error: err,
    };
  }
};
