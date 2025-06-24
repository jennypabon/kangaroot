import { Router } from 'express';
import { login, verifyToken } from '../controllers/authController';

const router = Router();

// POST /api/auth/login - Company login
router.post('/login', login);

// GET /api/auth/verify - Verify JWT token
router.get('/verify', verifyToken);

export default router;