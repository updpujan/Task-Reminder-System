import bcrypt from 'bcrypt';
import { tokenGeneration } from '../../utils/jwt.js';
import { userByEmail } from '../../repository/auth/findUser.js';

const loginService = async (email: string, password: string) => {
  const result = await userByEmail(email);
  if (result.rowCount === 0) return '401';

  const checkPassword = await bcrypt.compare(password, result.rows[0].password);
  if (!checkPassword) return '401';

  const id = result.rows[0].id;
  const role = result.rows[0].role;
  const jwt_token = tokenGeneration(id, role);
  return jwt_token;
};

export default loginService;
