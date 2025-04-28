import express from 'express';
import {
  getGeneralSettings,
  updateGeneralSettings,
  getAiSettings,
  updateAiSettings,
  getAdvancedSettings,
  updateAdvancedSettings,
  backupData,
  restoreData
} from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả các route đều được bảo vệ
router.use(protect);

// Route cài đặt chung
router.route('/general')
  .get(getGeneralSettings)
  .put(updateGeneralSettings);

// Route cài đặt AI
router.route('/ai')
  .get(getAiSettings)
  .put(updateAiSettings);

// Route cài đặt nâng cao (chỉ admin)
router.route('/advanced')
  .get(admin, getAdvancedSettings)
  .put(admin, updateAdvancedSettings);

// Route sao lưu và khôi phục dữ liệu (chỉ admin)
router.route('/backup')
  .post(admin, backupData);

router.route('/restore')
  .post(admin, restoreData);

export default router;
