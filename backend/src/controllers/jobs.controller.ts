import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/job.service';

export async function getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(100, parseInt((req.query.pageSize as string) || '20', 10));
    const source = req.query.source as string | undefined;

    res.json(await jobService.getJobs(page, pageSize, source));
  } catch (err) {
    next(err);
  }
}
