import { pool } from '../db';
import { NormalizedJob } from '../types';

export interface PaginatedJobs {
  jobs: NormalizedJob[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getJobs(
  page = 1,
  pageSize = 20,
  source?: string
): Promise<PaginatedJobs> {
  const offset = (page - 1) * pageSize;
  const hasFilter = Boolean(source);

  const [jobsRes, countRes] = await Promise.all([
    pool.query<NormalizedJob>(
      `SELECT id, title, company, skills, salary, location, source, url, created_at, ingested_at
       FROM jobs
       ${hasFilter ? 'WHERE source = $3' : ''}
       ORDER BY ingested_at DESC, created_at DESC
       LIMIT $1 OFFSET $2`,
      hasFilter ? [pageSize, offset, source] : [pageSize, offset]
    ),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM jobs ${hasFilter ? 'WHERE source = $1' : ''}`,
      hasFilter ? [source] : []
    ),
  ]);

  return {
    jobs: jobsRes.rows,
    total: parseInt(countRes.rows[0]?.count || '0', 10),
    page,
    pageSize,
  };
}
