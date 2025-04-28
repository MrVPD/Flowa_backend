import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  manageApiKeys,
  beginRegistration,
  completeRegistration,
  verifyEmail,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/register-begin', beginRegistration);
router.post('/register-complete', completeRegistration);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/api-keys', protect, manageApiKeys);

export default router;
