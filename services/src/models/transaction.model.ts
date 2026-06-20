import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  txnId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  gateway: 'ESEWA';
  plan: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  txnId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  gateway: { type: String, enum: ['ESEWA'], default: 'ESEWA' },
  plan: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
