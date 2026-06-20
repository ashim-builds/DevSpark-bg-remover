import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware';
import { processImage, getImageHistory } from '../controllers/image.controller';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);
router.post('/process', upload.single('image'), processImage);
router.get('/history', getImageHistory);

export default router;
