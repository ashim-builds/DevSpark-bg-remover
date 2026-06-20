import express from 'express';
import passport from 'passport';
import multer from 'multer';
import { loginUser, logoutUser, refreshToken, registerUser, requestPasswordReset, resetPassword, verifyEmail, csrfToken, googleCallback, googleLoginRedirect } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } from '../utils/validation.util';

const router = express.Router();
const upload = multer();

router.get('/csrf-token', csrfToken);
router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.post('/forgot-password', validateBody(passwordResetRequestSchema), requestPasswordReset);
router.post('/reset-password', validateBody(passwordResetSchema), resetPassword);
router.get('/verify-email', verifyEmail);
router.get('/google', googleLoginRedirect);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

export default router;
