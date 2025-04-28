import express from 'express';
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  uploadBrandImages
} from '../controllers/brandController.js';
import { protect, brandManager } from '../middleware/authMiddleware.js';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Brand routes
router.route('/')
  .post(brandManager, createBrand)
  .get(getBrands);

router.route('/:id')
  .get(getBrandById)
  .put(brandManager, updateBrand)
  .delete(brandManager, deleteBrand);

// Upload routes
router.post('/:id/logo', brandManager, uploadSingle('logo'), uploadBrandLogo);
router.post('/:id/images', brandManager, uploadMultiple('images', 10), uploadBrandImages);

export default router;
