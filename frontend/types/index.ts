export interface Job {
  id: string;
  title: string;
  company: string;
  skills: string[];
  salary: string | null;
  location: string;
  source: 'remotive' | 'arbeitnow';
  url?: string;
  created_at: string;
}

export interface TopSkill {
  skill: string;
  count: number;
}

export interface SalaryTrend {
  date: string;
  average_salary: number | null;
  job_count: number;
}

export interface LocationStat {
  location: string;
  count: number;
}

export interface JobStats {
  total_today: number;
  most_hiring_company: string;
  remote_percentage: number;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
}
