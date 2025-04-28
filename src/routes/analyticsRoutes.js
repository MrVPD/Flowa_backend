import express from 'express';
import {
  getContentStats,
  getSocialPerformance,
  getContentAnalysis,
  getImprovementSuggestions
} from '../controllers/analyticsController.js';
import { protect, contentCreator } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả các route đều được bảo vệ
router.use(protect);

// Route phân tích và báo cáo
router.route('/content-stats')
  .get(contentCreator, getContentStats);

router.route('/social-performance')
  .get(contentCreator, getSocialPerformance);

router.route('/content-analysis')
  .get(contentCreator, getContentAnalysis);

router.route('/improvement-suggestions')
  .get(contentCreator, getImprovementSuggestions);

export default router;
