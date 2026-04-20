import express from 'express';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserProfile,
  createOrUpdateProfile,
  getUserStats,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getCourseEnrollments,
  enrollInCourse,
  updateCourseProgress,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// User routes — admin only
router.route('/').get(protect, adminOnly, getAllUsers);

// Profile routes
router.route('/profile').post(createOrUpdateProfile);
router.route('/profile/:email').get(getUserProfile);

// Stats route
router.route('/stats/:email').get(getUserStats);

// Saved jobs routes
router.route('/saved-jobs').post(saveJob);
router.route('/saved-jobs/:email').get(getSavedJobs);
router.route('/saved-jobs/:savedJobId').delete(unsaveJob);

// Course enrollment routes
router.route('/enrollments').post(enrollInCourse);
router.route('/enrollments/:email').get(getCourseEnrollments);
router.route('/enrollments/:enrollmentId').put(updateCourseProgress);

// /:id must be LAST — it catches everything else
router.route('/:id').all(validateObjectId('id')).delete(protect, adminOnly, deleteUser);

export default router;
