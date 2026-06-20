import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(value, salt);
};

export const compareHash = async (value: string, hashed: string) => {
  return bcrypt.compare(value, hashed);
};

export const generateApiKey = () => {
  return `sc_live_${crypto.randomBytes(16).toString('hex')}`;
};

export const randomToken = () => crypto.randomBytes(32).toString('hex');
