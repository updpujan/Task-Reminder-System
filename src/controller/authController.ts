import { Request, Response } from 'express';
import registerService from '../application/auth/registerService.js';

export const registration = async (req: Request, res: Response) => {
  await registerService(req.body);
  res.status(201).json({
    sucess: true,
    message: 'New User Registered Sucessfully',
  });
};
