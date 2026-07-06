import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

// Map POST /api/auth/register to our controller execution logic
router.post('/register', AuthController.register);

export default router;
