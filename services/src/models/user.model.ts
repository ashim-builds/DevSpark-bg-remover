import mongoose, { Document, Schema } from 'mongoose';

export interface IApiKey {
  hashedKey: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  usage: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  credits: number;
  subscription: {
    plan: 'FREE' | 'PRO' | 'ENTERPRISE' | null;
    status: 'ACTIVE' | 'CANCELED' | 'PAUSED' | 'TRIAL' | null;
    currentPeriodEndsAt?: Date;
  };
  googleId?: string;
  emailVerified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  apiKeys: IApiKey[];
  refreshTokens: string[];
}

const ApiKeySchema = new Schema<IApiKey>({
  hashedKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  expiresAt: { type: Date },
  usage: { type: Number, default: 0 },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
  credits: { type: Number, default: 5 },
  subscription: {
    plan: { type: String, enum: ['FREE', 'PRO', 'ENTERPRISE', null], default: 'FREE' },
    status: { type: String, enum: ['ACTIVE', 'CANCELED', 'PAUSED', 'TRIAL', null], default: 'ACTIVE' },
    currentPeriodEndsAt: { type: Date },
  },
  googleId: { type: String },
  emailVerified: { type: Boolean, default: false },
  apiKeys: { type: [ApiKeySchema], default: [] },
  refreshTokens: { type: [String], default: [] },
});

export default mongoose.model<IUser>('User', UserSchema);
