import { Request, Response, NextFunction } from 'express';
import { userByEmail } from '../repository/auth/findUser.js';

const emailCheck = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;

  const result = await userByEmail(email);

  if (Number(result.rows) != 0) {
    return res.status(409).json({
      sucess: false,
      message: 'validation failed',
      errors: 'user already exists',
    });
  }
  next();
};

export default emailCheck;
