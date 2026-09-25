import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../schema/registation/registerSchema.js';

const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      sucess: false,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => issue.message),
    });
  }
  req.body = result.data;
  next();
};

export default validateRegistration;
