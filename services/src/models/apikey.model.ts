import mongoose, { Document, Schema } from 'mongoose';

export interface IApiKeyDoc extends Document {
  userId: mongoose.Types.ObjectId;
  hashedKey: string;
  usage: number;
  expiresAt?: Date;
  createdAt: Date;
}

const ApiKeySchema = new Schema<IApiKeyDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hashedKey: { type: String, required: true },
  usage: { type: Number, default: 0 },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IApiKeyDoc>('ApiKey', ApiKeySchema);
