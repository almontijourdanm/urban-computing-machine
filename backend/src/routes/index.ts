import { Router } from 'express';
import analyticsRoutes from './analytics.routes';
import jobsRoutes from './jobs.routes';

const router = Router();

router.use('/analytics', analyticsRoutes);
router.use('/jobs',      jobsRoutes);

export default router;
