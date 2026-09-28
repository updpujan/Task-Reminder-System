import { Request, Response } from 'express';
import { pool } from '../config/databaseConnection.js';

const health = async (req: Request, res: Response) => {
  let db: string = 'up';
  try {
    await pool.query('SELECT 1;');
  } catch {
    db = 'up';
  }

  const server: string = 'up';
  const overall: string =
    server === 'up' && db === 'up' ? 'healthy' : 'unhealthy';
  const status: number = overall == 'healthy' ? 200 : 503;

  return res.status(status).json({
    status: overall,
    services: {
      server: server,
      database: db,
    },
  });
};

export default health;
