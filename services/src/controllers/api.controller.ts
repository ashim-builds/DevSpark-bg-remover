import { Response } from 'express';
import ApiKey from '../models/apikey.model';
import User from '../models/user.model';
import { generateApiKey, hashValue } from '../services/crypto.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getApiDocs = async (_req: Request, res: Response) => {
  res.json({
    docs: {
      endpoint: '/api/sparkcut',
      headers: { Authorization: 'Bearer YOUR_API_KEY' },
      body: { imageUrl: 'https://...' },
      usage: '5 requests/day on free plan, unlimited on pro',
    },
  });
};

export const getApiUsage = async (req: AuthRequest, res: Response) => {
  const keys = await ApiKey.find({ userId: req.user.id });
  res.json({ usage: keys.map((key) => ({ id: key.id, usage: key.usage, expiresAt: key.expiresAt })) });
};

export const getApiKeys = async (req: AuthRequest, res: Response) => {
  const keys = await ApiKey.find({ userId: req.user.id });
  res.json({ keys: keys.map((key) => ({ id: key.id, expiresAt: key.expiresAt })) });
};

export const createApiKey = async (req: AuthRequest, res: Response) => {
  const rawKey = generateApiKey();
  const hashedKey = await hashValue(rawKey);
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const apiKey = await ApiKey.create({ userId: req.user.id, hashedKey, usage: 0, expiresAt });
  await User.findByIdAndUpdate(req.user.id, { $push: { apiKeys: { hashedKey, createdAt: new Date(), expiresAt, usage: 0 } } });

  res.status(201).json({ apiKey: rawKey, apiKeyId: apiKey.id });
};

export const revokeApiKey = async (req: AuthRequest, res: Response) => {
  const keyId = req.params.id;
  await ApiKey.deleteOne({ _id: keyId, userId: req.user.id });
  res.json({ message: 'API key revoked' });
};
