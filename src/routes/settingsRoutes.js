import express from 'express';
import multer from 'multer';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getSettings,
  getPublicSettings,
  updateSettings,
  uploadQrImage,
  validateCoupon,
} from '../controllers/settingsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
router.get('/public', getPublicSettings);
router.post('/validate-coupon', validateCoupon);

// Admin-only routes
router.get('/', protect, adminOnly, getSettings);
router.put('/', protect, adminOnly, updateSettings);
router.post('/upload-qr', protect, adminOnly, upload.single('qr'), uploadQrImage);

export default router;
