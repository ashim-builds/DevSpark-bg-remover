import { Request, Response } from 'express';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import Image from '../models/image.model';

export const getAdminUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password -refreshTokens -apiKeys');
  res.json({ users });
};

export const getAdminStats = async (_req: Request, res: Response) => {
  const usersCount = await User.countDocuments();
  const transactionsCount = await Transaction.countDocuments();
  const totalRevenue = await Transaction.aggregate([
    { $match: { status: 'COMPLETED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalImages = await Image.countDocuments();

  res.json({
    usersCount,
    transactionsCount,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalImages,
  });
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { plan, status, currentPeriodEndsAt } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.subscription.plan = plan || user.subscription.plan;
  user.subscription.status = status || user.subscription.status;
  user.subscription.currentPeriodEndsAt = currentPeriodEndsAt ? new Date(currentPeriodEndsAt) : user.subscription.currentPeriodEndsAt;
  await user.save();
  res.json({ message: 'Subscription updated', subscription: user.subscription });
};

export const getPaymentHistory = async (_req: Request, res: Response) => {
  const history = await Transaction.find().sort({ createdAt: -1 }).limit(100);
  res.json({ history });
};
