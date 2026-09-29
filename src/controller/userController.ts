import { Request, Response } from 'express';
import * as users from '../repository/users/usersRepo.js';

export const getAllUsers = async (req: Request, res: Response) => {
  const response = await users.getAllUsers();
  if (response.status === 200) {
    return res.status(200).json({
      sucess: true,
      message: response.message,
      users: response.users,
    });
  } else {
    if (response.status === 204) return res.status(204).send();
    else {
      return res.status(503).json({
        sucess: false,
        message: response.message,
        error: response.error,
      });
    }
  }
};
