import express from 'express';
import { googleAuth } from '../controllers/authController.js';

const router = express.Router();

// Google authentication
router.post('/google', googleAuth);

export default router; 