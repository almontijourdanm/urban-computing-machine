// ── Normalized domain model ───────────────────────────────────

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  skills: string[];
  salary: string | null;
  location: string;
  source: 'remotive' | 'arbeitnow';
  url: string;
  created_at: string;
  ingested_at?: string;
}

// ── Analytics response shapes ─────────────────────────────────

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

// ── Remotive API ──────────────────────────────────────────────

export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  tags: string[];
  salary: string;
  candidate_required_location: string;
  publication_date: string;
}

export interface RemotiveResponse {
  jobs: RemotiveJob[];
}

// ── Arbeitnow API ─────────────────────────────────────────────

export interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: string | number;
  url: string;
}

export interface ArbeitnowResponse {
  data: ArbeitnowJob[];
}
