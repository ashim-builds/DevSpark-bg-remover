import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createApiKey, revokeApiKey, getApiKeys, getApiDocs, getApiUsage } from '../controllers/api.controller';

const router = express.Router();
router.use(authenticate);
router.get('/docs', getApiDocs);
router.get('/usage', getApiUsage);
router.get('/keys', getApiKeys);
router.post('/keys', createApiKey);
router.delete('/keys/:id', revokeApiKey);

export default router;
