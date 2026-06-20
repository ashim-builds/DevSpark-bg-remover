import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required in environment variables');
  }

  await mongoose.connect(uri, {
    dbName: 'sparkcut-ai',
  });

  console.log('Connected to MongoDB Atlas');
};
