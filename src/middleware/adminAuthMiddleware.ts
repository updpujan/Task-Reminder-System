import { Request, Response, NextFunction } from 'express';

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role == 'admin') next();
  return res.status(401).json({
    sucess: false,
    message: 'Unauthorized: role not authorized for this resouce',
  });
};

export default adminAuth;
