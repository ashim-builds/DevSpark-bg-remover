import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8).max(64),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});

export const apiKeyPurchaseSchema = z.object({
  plan: z.enum(['API_BASIC', 'API_PRO', 'PRO_MONTHLY', 'PRO_YEARLY']),
});

export const subscriptionSchema = z.object({
  plan: z.enum(['PRO_MONTHLY', 'PRO_YEARLY', 'API_BASIC', 'API_PRO']),
});
