import express from 'express';
import validateObjectId from '../middleware/validateObjectId.js';
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
  .post(createCourse);

router.route('/:id')
  .all(validateObjectId('id'))
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;
