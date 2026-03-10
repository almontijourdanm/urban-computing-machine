import type { Job, TopSkill, SalaryTrend, LocationStat, JobStats, PaginatedJobs } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getTopSkills: (limit = 15) =>
    fetchJSON<{ data: TopSkill[] }>(`/analytics/top-skills?limit=${limit}`),

  getSalaryTrends: (days = 30) =>
    fetchJSON<{ data: SalaryTrend[] }>(`/analytics/salary-trends?days=${days}`),

  getJobLocations: (limit = 10) =>
    fetchJSON<{ data: LocationStat[] }>(`/analytics/job-locations?limit=${limit}`),

  getJobCount: () =>
    fetchJSON<{ data: JobStats }>('/analytics/job-count'),

  getJobs: (page = 1, pageSize = 20, source?: string): Promise<PaginatedJobs> => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (source) params.set('source', source);
    return fetchJSON<PaginatedJobs>(`/jobs?${params}`);
  },
} satisfies Record<string, (...args: never[]) => Promise<unknown>>;

// Re-export so pages don't need a separate import
export type { Job, TopSkill, SalaryTrend, LocationStat, JobStats, PaginatedJobs };
