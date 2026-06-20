import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  userId: mongoose.Types.ObjectId;
  originalUrl: string;
  processedUrl: string;
  size: number;
  format: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  processedUrl: { type: String, required: true },
  size: { type: Number, required: true },
  format: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IImage>('Image', ImageSchema);
