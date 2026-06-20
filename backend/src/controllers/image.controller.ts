import { Response } from 'express';
import Image from '../models/image.model';
import { uploadImageBuffer } from '../services/cloudinary.service';
import { removeBackground } from '../services/removebg.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const processImage = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const buffer = req.file.buffer;
  const format = req.file.mimetype.split('/')[1] || 'png';
  const allowedTypes = ['png', 'jpg', 'jpeg', 'webp'];
  
  if (!allowedTypes.includes(format.toLowerCase())) {
    return res.status(400).json({ message: 'Unsupported image format. Use PNG, JPG, JPEG, or WEBP' });
  }

  if (buffer.length > 10 * 1024 * 1024) {
    return res.status(400).json({ message: 'Image size exceeds 10MB limit' });
  }

  try {
    // Upload original image to Cloudinary
    const originalUpload = await uploadImageBuffer(buffer, 'sparkcut-ai/originals');
    
    // Process image locally using background removal algorithm
    const processedBuffer = await removeBackground(buffer);
    
    // Upload processed image to Cloudinary
    const processedUpload = await uploadImageBuffer(processedBuffer, 'sparkcut-ai/processed');

    // Save to database
    const image = await Image.create({
      userId: req.user.id,
      originalUrl: originalUpload.secure_url,
      processedUrl: processedUpload.secure_url,
      size: buffer.length,
      format: 'png',
    });

    // Deduct credit
    await req.user.updateOne({ $inc: { credits: -1 } });

    res.json({
      success: true,
      message: 'Background removed successfully',
      image: {
        id: image.id,
        originalUrl: image.originalUrl,
        processedUrl: image.processedUrl,
        size: image.size,
        format: image.format,
        createdAt: image.createdAt,
      },
      remainingCredits: req.user.credits - 1,
    });
  } catch (error: any) {
    console.error('Image processing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process image: ' + error.message 
    });
  }
};

export const getImageHistory = async (req: AuthRequest, res: Response) => {
  try {
    const images = await Image.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ 
      success: true,
      history: images 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch history' 
    });
  }
};
