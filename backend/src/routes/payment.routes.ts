import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createPaymentIntent, verifyPayment, esewaWebhook, getTransactionHistory } from '../controllers/payment.controller';

const router = express.Router();
router.use(authenticate);
router.post('/create', createPaymentIntent);
router.post('/verify', verifyPayment);
router.post('/webhook', esewaWebhook);
router.get('/transactions', getTransactionHistory);

export default router;
