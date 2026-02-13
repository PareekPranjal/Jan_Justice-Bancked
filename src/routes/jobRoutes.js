import express from 'express';
import upload from '../middleware/upload.js';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), createJob);

router.route('/:id')
  .get(getJobById)
  .put(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateJob)
  .delete(deleteJob);

export default router;
