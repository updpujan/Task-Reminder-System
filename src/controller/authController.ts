import { Request, Response } from 'express';
import registerService from '../application/auth/registerService.js';
import loginService from '../application/auth/loginService.js';
import { registerSchema } from '../schema/registation/registerSchema.js';

export const registration = async (req: Request, res: Response) => {
  await registerService(req.body);
  res.status(201).json({
    sucess: true,
    message: 'New User Registered Sucessfully',
  });
};

export const login = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      sucess: false,
      message: 'Login failed',
      errors: 'Invalid Request: no email or password',
    });
  }
  const emailSchema = registerSchema.shape.email;
  const result = emailSchema.safeParse(req.body.email);
  if (!result.success) {
    return res.status(401).json({
      sucess: false,
      message: 'Login failed',
      errors: 'Invalid Email or password',
    });
  }
  const response = await loginService(result.data, req.body.password);
  if (response == '401') {
    return res.status(401).json({
      sucess: false,
      message: 'Login Failed',
      errors: 'Invalid Email or password',
    });
  }

  res.status(200).json({
    sucess: true,
    message: 'Login Sucessfully',
    token: response,
  });
};

//
//export const logout = (req:Request,res:Response) => {

//}
