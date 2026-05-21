import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, upload.array('images', 10), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.array('images', 10), updateProduct)
  .delete(protect, deleteProduct);

export default router;
