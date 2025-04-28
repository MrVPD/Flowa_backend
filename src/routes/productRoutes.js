import express from 'express';
import {
  createProduct,
  getProductsByBrand,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages
} from '../controllers/productController.js';
import { protect, brandManager } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Product routes
router.route('/')
  .post(brandManager, createProduct);

router.route('/brand/:brandId')
  .get(getProductsByBrand);

router.route('/:id')
  .get(getProductById)
  .put(brandManager, updateProduct)
  .delete(brandManager, deleteProduct);

// Upload routes
router.post('/:id/images', brandManager, uploadMultiple('images', 10), uploadProductImages);

export default router;
