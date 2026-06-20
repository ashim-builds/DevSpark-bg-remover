import { Response } from 'express';
import Image from '../models/image.model';
import { uploadImageBuffer } from '../services/cloudinary.service';
import { removeBackground } from '../services/removebg.service';
import ApiKey from '../models/apikey.model';
import { ApiRequest } from '../middleware/apiKey.middleware';

export const processPublicImage = async (req: ApiRequest, res: Response) => {
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

  const processedBuffer = await removeBackground(imageUrl);
  const processedUpload = await uploadImageBuffer(processedBuffer, 'sparkcut-ai/public-processed');

  await ApiKey.findByIdAndUpdate(req.apiKeyDocument.id, { $inc: { usage: 1 } });

  const image = await Image.create({
    userId: req.apiKeyDocument.userId,
    originalUrl: imageUrl,
    processedUrl: processedUpload.secure_url,
    size: processedBuffer.length,
    format: 'png',
  });

  res.json({ processedUrl: processedUpload.secure_url, imageId: image.id });
};
