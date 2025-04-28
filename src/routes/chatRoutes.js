import express from 'express';
import {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
  generateContent,
  parseCommand
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat routes
router.route('/')
  .post(createChat)
  .get(getUserChats);

router.route('/:id')
  .get(getChatById);

router.route('/:id/message')
  .post(sendMessage);

router.route('/:id/generate')
  .post(generateContent);

router.route('/:id/parse-command')
  .post(parseCommand);

export default router;
