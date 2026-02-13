import express from 'express';
import { getLatestVideos } from '../controllers/youtubeController.js';

const router = express.Router();

router.route('/latest').get(getLatestVideos);

export default router;
