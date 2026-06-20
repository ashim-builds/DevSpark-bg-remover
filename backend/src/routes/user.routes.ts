import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUserProfile, updateUserProfile, getDashboard } from '../controllers/user.controller';
import { validateBody } from '../middleware/validate.middleware';
import { profileUpdateSchema } from '../utils/validation.util';

const router = express.Router();
router.use(authenticate);
router.get('/me', getUserProfile);
router.put('/me', validateBody(profileUpdateSchema), updateUserProfile);
router.get('/dashboard', getDashboard);

export default router;
