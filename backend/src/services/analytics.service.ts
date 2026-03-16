import { pool } from '../db';
import { TopSkill, SalaryTrend, LocationStat, JobStats } from '../types';

export async function getTopSkills(limit = 15): Promise<TopSkill[]> {
  const { rows } = await pool.query<{ skill: string; count: string }>(
    `SELECT skill, COUNT(*) AS count
     FROM jobs, jsonb_array_elements_text(skills) AS skill
     GROUP BY skill
     ORDER BY count DESC
     LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({ skill: r.skill, count: parseInt(r.count, 10) }));
}

export async function getSalaryTrends(days = 30): Promise<SalaryTrend[]> {
  const { rows } = await pool.query<{
    date: string;
    average_salary: string | null;
    job_count: string;
  }>(
    `SELECT
       DATE_TRUNC('day', created_at)::date::text AS date,
       AVG(
         CASE
           WHEN salary ~ '^[0-9]+$'      THEN salary::numeric
           WHEN salary ~ '[0-9]+'        THEN (regexp_match(salary, '[0-9]+'))[1]::numeric
           ELSE NULL
         END
       ) AS average_salary,
       COUNT(*) AS job_count
     FROM jobs
     WHERE created_at >= NOW() - ($1 || ' days')::interval
     GROUP BY DATE_TRUNC('day', created_at)
     ORDER BY date ASC`,
    [days]
  );
  return rows.map((r) => ({
    date: r.date,
    average_salary: r.average_salary ? parseFloat(r.average_salary) : null,
    job_count: parseInt(r.job_count, 10),
  }));
}

export async function getJobLocations(limit = 10): Promise<LocationStat[]> {
  const { rows } = await pool.query<{ location: string; count: string }>(
    `SELECT
       COALESCE(NULLIF(TRIM(location), ''), 'Unknown') AS location,
       COUNT(*) AS count
     FROM jobs
     GROUP BY location
     ORDER BY count DESC
     LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({ location: r.location, count: parseInt(r.count, 10) }));
}

export async function getJobStats(): Promise<JobStats> {
  const [todayRes, companyRes, remoteRes] = await Promise.all([
    pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM jobs WHERE created_at >= NOW() - INTERVAL '24 hours'`
    ),
    pool.query<{ company: string }>(
      `SELECT company FROM jobs
       WHERE created_at >= NOW() - INTERVAL '24 hours'
       GROUP BY company ORDER BY COUNT(*) DESC LIMIT 1`
    ),
    pool.query<{ remote_count: string; total_count: string }>(
      `SELECT
         COUNT(*) FILTER (WHERE LOWER(location) LIKE '%remote%') AS remote_count,
         COUNT(*)                                                 AS total_count
       FROM jobs
       WHERE created_at >= NOW() - INTERVAL '24 hours'`
    ),
  ]);

  const total = parseInt(todayRes.rows[0]?.count || '0', 10);
  const remoteCount = parseInt(remoteRes.rows[0]?.remote_count || '0', 10);
  const totalCount = parseInt(remoteRes.rows[0]?.total_count || '0', 10);

  return {
    total_today: total,
    most_hiring_company: companyRes.rows[0]?.company || 'N/A',
    remote_percentage: totalCount > 0 ? Math.round((remoteCount / totalCount) * 100) : 0,
  };
}
