import { Response } from 'express';
import crypto from 'crypto';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import { AuthRequest } from '../middleware/auth.middleware';

const planPricing = {
  PRO_MONTHLY: 499,
  PRO_YEARLY: 4999,
  API_BASIC: 999,
  API_PRO: 2999,
};

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  const amount = planPricing[plan] || 0;
  if (!amount) return res.status(400).json({ message: 'Unknown product plan' });

  const txnId = crypto.randomBytes(12).toString('hex');
  await Transaction.create({ userId: req.user.id, amount, txnId, plan, status: 'PENDING', gateway: 'ESEWA' });

  res.json({ merchant: process.env.ESEWA_MERCHANT_ID, amount, txnId, message: 'Send payment to eSewa and verify after completion' });
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { txnId, refId, amount, productId } = req.body;
  const transaction = await Transaction.findOne({ txnId, status: 'PENDING' });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  const expectedAmount = transaction.amount;
  if (Number(amount) !== expectedAmount) return res.status(400).json({ message: 'Amount mismatch' });

  transaction.status = 'COMPLETED';
  await transaction.save();

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (transaction.plan === 'PRO_MONTHLY') {
    user.subscription = { plan: 'PRO', status: 'ACTIVE', currentPeriodEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
    user.credits = 99999;
  } else if (transaction.plan === 'PRO_YEARLY') {
    user.subscription = { plan: 'PRO', status: 'ACTIVE', currentPeriodEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) };
    user.credits = 99999;
  } else if (transaction.plan === 'API_BASIC' || transaction.plan === 'API_PRO') {
    user.subscription = { plan: 'ENTERPRISE', status: 'ACTIVE', currentPeriodEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) };
  }
  await user.save();

  res.json({ message: 'Payment verified', refId });
};

export const esewaWebhook = async (req: Request, res: Response) => {
  const { txnId, status, amount, productId } = req.body;
  const transaction = await Transaction.findOne({ txnId });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

  transaction.status = status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
  await transaction.save();
  res.json({ message: 'Webhook processed' });
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  const history = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  res.json({ transactions: history });
};
