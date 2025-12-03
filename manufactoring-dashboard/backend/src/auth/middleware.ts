import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number; role: 'USER' | 'ADMIN' };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[config.cookieName];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.auth = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
  if (req.auth.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
}
