import express from 'express';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, adminOnly, createCourse);

router.route('/:id')
  .all(validateObjectId('id'))
  .get(getCourseById)
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

export default router;
