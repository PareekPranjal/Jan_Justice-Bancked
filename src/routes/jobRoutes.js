import express from 'express';
import upload from '../middleware/upload.js';
import validateObjectId from '../middleware/validateObjectId.js';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  uploadPdf,
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/upload-pdf', upload.single('pdf'), uploadPdf);

router.route('/')
  .get(getJobs)
  .post(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), createJob);

router.route('/:id')
  .all(validateObjectId('id'))
  .get(getJobById)
  .put(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateJob)
  .delete(deleteJob);

export default router;
