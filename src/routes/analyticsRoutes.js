import express from 'express';
import { trackVisit, getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/track', trackVisit);
router.get('/', getAnalytics);

export default router;
