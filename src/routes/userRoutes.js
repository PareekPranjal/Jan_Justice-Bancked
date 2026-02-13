import express from 'express';
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

// User routes
router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser);

// Profile routes
router.route('/profile').post(createOrUpdateProfile);
router.route('/profile/:email').get(getUserProfile);

// Stats route
router.route('/stats/:email').get(getUserStats);

// Saved jobs routes
router.route('/saved-jobs/:email').get(getSavedJobs);
router.route('/saved-jobs').post(saveJob);
router.route('/saved-jobs/:savedJobId').delete(unsaveJob);

// Course enrollment routes
router.route('/enrollments/:email').get(getCourseEnrollments);
router.route('/enrollments').post(enrollInCourse);
router.route('/enrollments/:enrollmentId').put(updateCourseProgress);

export default router;
