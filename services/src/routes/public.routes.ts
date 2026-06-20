import express from 'express';
import multer from 'multer';
import { authenticateApiKey } from '../middleware/apiKey.middleware';
import { processPublicImage } from '../controllers/public.controller';

const router = express.Router();
const upload = multer();

router.post('/sparkcut', authenticateApiKey, upload.none(), processPublicImage);

export default router;
