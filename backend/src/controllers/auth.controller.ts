import { Request, Response } from 'express';
import passport from 'passport';
import crypto from 'crypto';
import User from '../models/user.model';
import { hashValue, compareHash, randomToken } from '../services/crypto.service';
import { signAccessToken, signRefreshToken } from '../utils/token.util';
import { sendEmail } from '../utils/email.util';

const createTokens = async (userId: string) => {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });
  return { accessToken, refreshToken };
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hashedPassword = await hashValue(password);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
    subscription: { plan: 'FREE', status: 'ACTIVE' },
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
  await sendEmail(
    email,
    'Verify your SparkCut AI email',
    `<p>Welcome to SparkCut AI. Confirm your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
  );

  user.set('verificationToken', verificationToken);
  await user.save();

  const { accessToken, refreshToken } = await createTokens(user.id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ message: 'Registered successfully. Verify your email.' });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = user.password ? await compareHash(password, user.password) : false;
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const { accessToken, refreshToken } = await createTokens(user.id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ message: 'Login successful' });
};

export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const verified = verifyRefreshToken<{ userId: string }>(token);
    const user = await User.findById(verified.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await createTokens(user.id);
    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    setAuthCookies(res, accessToken, newRefreshToken);
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If account exists, instructions are sent' });

  const resetToken = randomToken();
  user.set('passwordResetToken', resetToken);
  user.set('passwordResetExpires', Date.now() + 1000 * 60 * 60);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  await sendEmail(email, 'Reset your SparkCut AI password', `<p>Reset your password <a href="${resetUrl}">here</a>.</p>`);
  res.json({ message: 'If account exists, instructions are sent' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid reset token' });

  user.password = await hashValue(password);
  user.set('passwordResetToken', undefined);
  user.set('passwordResetExpires', undefined);
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token, email } = req.query;
  if (!token || !email) return res.status(400).json({ message: 'Verification link invalid' });

  const user = await User.findOne({ email, verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Verification link invalid' });

  user.emailVerified = true;
  user.set('verificationToken', undefined);
  await user.save();

  res.json({ message: 'Email verified successfully' });
};

export const csrfToken = (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken ? req.csrfToken() : '' });
};

export const googleLoginRedirect = (req: Request, res: Response) => {
  res.redirect('/api/auth/google');
};

export const googleCallback = async (req: Request, res: Response) => {
  const profile = req.user as any;
  const email = profile?.emails?.[0]?.value;
  if (!email) return res.status(400).json({ message: 'Google login failed' });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: profile.displayName || email,
      email,
      googleId: profile.id,
      emailVerified: true,
      role: 'USER',
      credits: 5,
      subscription: { plan: 'FREE', status: 'ACTIVE' },
    });
  }

  const { accessToken, refreshToken } = await createTokens(user.id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};
