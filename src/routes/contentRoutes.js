import express from 'express';
import {
  generateContent,
  optimizeContent,
  analyzeKeywords,
  generateImage
} from '../controllers/contentGenerationController.js';
import { protect, contentCreator } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả các route đều được bảo vệ
router.use(protect);

// Route tạo nội dung
router.route('/generate')
  .post(contentCreator, generateContent);

// Route tối ưu nội dung
router.route('/optimize')
  .post(contentCreator, optimizeContent);

// Route phân tích từ khóa
router.route('/keywords')
  .get(contentCreator, analyzeKeywords);

// Route tạo hình ảnh
router.route('/generate-image')
  .post(contentCreator, generateImage);

export default router;
