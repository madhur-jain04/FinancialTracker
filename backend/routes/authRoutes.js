// backend/routes/authRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// The frontend calls these paths:
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;