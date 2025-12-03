import jwt from 'jsonwebtoken';
import { config } from '../config';

export type AuthPayload = {
  userId: number;
  role: 'USER' | 'ADMIN';
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as AuthPayload;
  } catch {
    return null;
  }
}
