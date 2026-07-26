import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewware/auth.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);

// Protected route (requireAuth middleware runs BEFORE AuthController.getProfile)
router.get('/me', requireAuth, AuthController.getProfile);

export default router;
