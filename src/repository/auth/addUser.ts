import { pool } from '../../config/databaseConnection.js';
import { UserModel } from '../../model/userModel.js';

const addUser = async (newUser: UserModel) => {
  const result = await pool.query(
    `INSERT INTO users (name,email,role,password)
        VALUES ($1,$2,$3,$4);`,
    [newUser.name, newUser.email, newUser.role, newUser.password],
  );
  return result;
};

export default addUser;
