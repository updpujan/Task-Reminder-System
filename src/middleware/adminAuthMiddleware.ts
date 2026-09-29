import { Request, Response, NextFunction } from 'express';

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    sucess: false,
    message: 'Forbidden: admin role required',
  });
};

export default adminAuth;
