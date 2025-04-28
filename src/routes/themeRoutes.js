import express from 'express';
import {
  createTheme,
  getThemesByBrand,
  getThemeById,
  updateTheme,
  deleteTheme
} from '../controllers/themeController.js';
import { protect, brandManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Theme routes
router.route('/')
  .post(brandManager, createTheme);

router.route('/brand/:brandId')
  .get(getThemesByBrand);

router.route('/:id')
  .get(getThemeById)
  .put(brandManager, updateTheme)
  .delete(brandManager, deleteTheme);

export default router;
