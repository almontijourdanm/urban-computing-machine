import { Router } from 'express';
import * as ctrl from '../controllers/jobs.controller';

const router = Router();

router.get('/', ctrl.getJobs);

export default router;
