import { Router } from 'express';
import { recordVisitAndGetStats } from '../controllers/statsController';

const router = Router();

// Endpoint for the frontend home page to record a visit and get stats
router.post('/visit', recordVisitAndGetStats);

export default router;