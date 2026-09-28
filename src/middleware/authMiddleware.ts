import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import { AuthPayload } from '../model/authPayload.js';

const userProtection = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization');

  //check if header is there or not
  if (!header) {
    return res.status(401).json({
      sucess: false,
      message: 'User is not authenticated',
    });
  } else {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        sucess: false,
        message: 'JWT secret is not configured',
      });
    }
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        sucess: false,
        message: 'Invalid authorization format',
      });
    }
    try {
      const decoded = Jwt.verify(token, secret, {
        algorithms: ['HS256'],
      });

      if (typeof decoded === 'string') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }

      if (typeof decoded.sub !== 'number' || typeof decoded.role !== 'string') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token payload',
        });
      }

      const payload: AuthPayload = {
        sub: decoded.sub,
        role: decoded.role,
      };

      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({
        sucess: false,
        message: 'Invalid or expired Token',
        err: err,
      });
    }
  }
};

export default userProtection;
