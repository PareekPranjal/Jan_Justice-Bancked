import express from 'express';
import upload from '../middleware/upload.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getBlogs,
  getFeaturedBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
} from '../controllers/blogController.js';

const router = express.Router();

router.post('/upload-image', protect, adminOnly, upload.single('image'), uploadBlogImage);
router.get('/featured', getFeaturedBlogs);

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route('/:id')
  .all(validateObjectId('id'))
  .get(getBlogById)
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

export default router;
