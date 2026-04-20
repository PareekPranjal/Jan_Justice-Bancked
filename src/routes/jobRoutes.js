import express from 'express';
import upload from '../middleware/upload.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  uploadPdf,
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/upload-pdf', protect, adminOnly, upload.single('pdf'), uploadPdf);

router.route('/')
  .get(getJobs)
  .post(protect, adminOnly, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), createJob);

router.route('/:id')
  .all(validateObjectId('id'))
  .get(getJobById)
  .put(protect, adminOnly, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateJob)
  .delete(protect, adminOnly, deleteJob);

export default router;
