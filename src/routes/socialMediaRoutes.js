import express from 'express';
import {
  connectSocialAccount,
  getSocialAccounts,
  createSocialPost,
  getSocialPosts,
  schedulePosts,
  updatePostStatus
} from '../controllers/socialMediaController.js';
import { protect, contentCreator } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả các route đều được bảo vệ
router.use(protect);

// Route quản lý tài khoản mạng xã hội
router.route('/connect')
  .post(contentCreator, connectSocialAccount);

router.route('/accounts')
  .get(contentCreator, getSocialAccounts);

// Route quản lý bài đăng
router.route('/post')
  .post(contentCreator, createSocialPost);

router.route('/posts')
  .get(contentCreator, getSocialPosts);

router.route('/schedule')
  .post(contentCreator, schedulePosts);

router.route('/posts/:id/status')
  .put(contentCreator, updatePostStatus);

export default router;
