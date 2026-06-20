import { Response } from 'express';
import Image from '../models/image.model';
import User from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  res.json({ profile: user });
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const updates = req.body;
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -refreshTokens -apiKeys');
  res.json({ profile: user });
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const totalImages = await Image.countDocuments({ userId: user.id });
  res.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      credits: user.credits,
      subscription: user.subscription,
      emailVerified: user.emailVerified,
    },
    totalImagesProcessed: totalImages,
  });
};
