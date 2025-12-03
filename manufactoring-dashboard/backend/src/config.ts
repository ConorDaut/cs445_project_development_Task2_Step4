import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  cookieName: process.env.COOKIE_NAME || 'auth_token',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
