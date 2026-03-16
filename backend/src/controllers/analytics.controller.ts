import { Request, Response, NextFunction } from 'express';
import * as analytics from '../services/analytics.service';

export async function getTopSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '15', 10), 50);
    res.json({ data: await analytics.getTopSkills(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getSalaryTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = Math.min(parseInt((req.query.days as string) || '30', 10), 365);
    res.json({ data: await analytics.getSalaryTrends(days) });
  } catch (err) {
    next(err);
  }
}

export async function getJobLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '10', 10), 50);
    res.json({ data: await analytics.getJobLocations(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getJobCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await analytics.getJobStats() });
  } catch (err) {
    next(err);
  }
}
