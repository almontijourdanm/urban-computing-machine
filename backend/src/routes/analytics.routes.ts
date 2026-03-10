import { Router } from 'express';
import * as ctrl from '../controllers/analytics.controller';

const router = Router();

router.get('/top-skills',    ctrl.getTopSkills);
router.get('/salary-trends', ctrl.getSalaryTrends);
router.get('/job-locations', ctrl.getJobLocations);
router.get('/job-count',     ctrl.getJobCount);

export default router;
