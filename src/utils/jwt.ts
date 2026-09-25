import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import 'dotenv/config';

export const tokenGeneration = (userId: number, role: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new Error('JWT_SECRET not defined');

  return jwt.sign(
    {
      sub: userId,
      role: role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN as StringValue,
    },
  );
};
