import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { getAdminUsers, getAdminStats, updateSubscriptionStatus, getPaymentHistory } from '../controllers/admin.controller';

const router = express.Router();
router.use(authenticate, authorizeAdmin);
router.get('/users', getAdminUsers);
router.get('/stats', getAdminStats);
router.put('/subscriptions/:userId', updateSubscriptionStatus);
router.get('/payments', getPaymentHistory);

export default router;
