import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsupersecret';

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = <T>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};

export const verifyRefreshToken = <T>(token: string): T => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as T;
};
