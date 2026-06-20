import { Request, Response, NextFunction } from 'express';
import ApiKey from '../models/apikey.model';
import { compareHash } from '../services/crypto.service';

export interface ApiRequest extends Request {
  apiKeyDocument?: any;
}

export const authenticateApiKey = async (req: ApiRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers['x-api-key'];
  const rawKey = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : '';
  if (!rawKey) return res.status(401).json({ message: 'API key required' });

  const apiKeys = await ApiKey.find();
  for (const key of apiKeys) {
    const valid = await compareHash(rawKey, key.hashedKey);
    if (valid) {
      if (key.expiresAt && key.expiresAt < new Date()) {
        return res.status(403).json({ message: 'API key expired' });
      }
      req.apiKeyDocument = key;
      return next();
    }
  }

  res.status(401).json({ message: 'Invalid API key' });
};
