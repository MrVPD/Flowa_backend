import express from 'express';
import {
  manageApiKeys,
  setAiParameters,
  getApiUsage,
  handleN8NWebhook,
  connectN8N,
  createN8NWorkflow,
  getApiDocumentation
} from '../controllers/integrationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route quản lý API key (cần đăng nhập)
router.route('/api-keys')
  .post(protect, manageApiKeys);

// Route thiết lập tham số AI (cần đăng nhập)
router.route('/ai-parameters')
  .post(protect, setAiParameters);

// Route theo dõi sử dụng API (cần đăng nhập)
router.route('/api-usage')
  .get(protect, getApiUsage);

// Route webhook N8N (công khai nhưng có xác thực riêng)
router.route('/n8n/webhook')
  .post(handleN8NWebhook);

// Route kết nối N8N (chỉ admin)
router.route('/n8n/connect')
  .post(protect, admin, connectN8N);

// Route tạo workflow N8N (chỉ admin)
router.route('/n8n/workflow')
  .post(protect, admin, createN8NWorkflow);

// Route tài liệu API công khai
router.route('/public-api/documentation')
  .get(getApiDocumentation);

export default router;
