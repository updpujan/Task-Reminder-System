import bcrypt from 'bcrypt';
import { UserModel } from '../../model/userModel.js';
import addUser from '../../repository/auth/addUser.js';

const registerService = async (userData: UserModel) => {
  const haspasswod = await bcrypt.hash(userData.password, 10);
  userData.password = haspasswod;
  const resposnse = await addUser(userData);
  return resposnse;
};

export default registerService;
