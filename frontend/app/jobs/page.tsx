import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api, Job } from '../../services/api';

type SourceFilter = 'all' | 'remotive' | 'arbeitnow';

interface JobsPageProps {
  searchParams?: {
    page?: string;
    source?: string;
  };
}

const PAGE_SIZE = 40;
const SECTION_PAGE_SIZE = 20;

function parsePage(page?: string): number {
  const parsed = parseInt(page || '1', 10);
  return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
}

function parseSource(source?: string): SourceFilter {
  if (source === 'remotive' || source === 'arbeitnow') return source;
  return 'all';
}

function makeJobsHref(page: number, source: SourceFilter): string {
  const params = new URLSearchParams({ page: String(page) });
  if (source !== 'all') params.set('source', source);
  return `/jobs?${params.toString()}`;
}

function JobListSection({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <p className="text-center py-8 text-terminal-muted text-sm">
        No jobs found for this source on this page.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="p-3 rounded border border-terminal-border hover:border-terminal-accent/30 hover:bg-white/[0.03] transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-terminal-text hover:text-terminal-accent transition-colors"
              >
                {job.title}
              </a>
              <p className="text-xs text-terminal-muted mt-0.5 truncate">
                {job.company} · {job.location}
              </p>
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {job.skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-1.5 py-0.5 rounded bg-terminal-accent/5 text-terminal-accent/80 border border-terminal-accent/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <Badge variant={job.source === 'remotive' ? 'accent' : 'green'}>
                {job.source}
              </Badge>
              {job.salary && (
                <span className="text-xs text-terminal-green">{job.salary}</span>
              )}
              <span className="text-xs text-terminal-muted" title={`Published: ${job.created_at}`}>
                Added {formatDistanceToNow(new Date(job.ingested_at || job.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({
  page,
  hasNext,
  source,
}: {
  page: number;
  hasNext: boolean;
  source: SourceFilter;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-terminal-muted">Page {page}</span>
      <div className="flex items-center gap-2">
        <Link
          href={makeJobsHref(Math.max(1, page - 1), source)}
          className={`px-3 py-1 rounded border ${
            page <= 1
              ? 'pointer-events-none opacity-40 border-terminal-border text-terminal-muted'
              : 'border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10'
          }`}
        >
          Previous
        </Link>
        <Link
          href={makeJobsHref(page + 1, source)}
          className={`px-3 py-1 rounded border ${
            !hasNext
              ? 'pointer-events-none opacity-40 border-terminal-border text-terminal-muted'
              : 'border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10'
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const page = parsePage(searchParams?.page);
  const source = parseSource(searchParams?.source);

  let allTotal = 0;
  let filteredJobs: Job[] = [];
  let remotiveJobs: Job[] = [];
  let arbeitnowJobs: Job[] = [];
  let remotiveTotal = 0;
  let arbeitnowTotal = 0;

  try {
    if (source === 'all') {
      const [remotiveRes, arbeitnowRes] = await Promise.all([
        api.getJobs(page, SECTION_PAGE_SIZE, 'remotive'),
        api.getJobs(page, SECTION_PAGE_SIZE, 'arbeitnow'),
      ]);
      remotiveJobs = remotiveRes.jobs;
      arbeitnowJobs = arbeitnowRes.jobs;
      remotiveTotal = remotiveRes.total;
      arbeitnowTotal = arbeitnowRes.total;
      allTotal = remotiveTotal + arbeitnowTotal;
    } else {
      const result = await api.getJobs(page, PAGE_SIZE, source);
      filteredJobs = result.jobs;
      allTotal = result.total;
    }
  } catch {
    // Backend offline — render empty state
  }

  const hasNext =
    source === 'all'
      ? remotiveTotal > page * SECTION_PAGE_SIZE || arbeitnowTotal > page * SECTION_PAGE_SIZE
      : allTotal > page * PAGE_SIZE;

  return (
    <>
      <Header title="Job Listings" />
      <main className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
        <Card title="Source Filter" badge={`${allTotal} total`}>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'remotive', 'arbeitnow'] as const).map((tab) => (
              <Link
                key={tab}
                href={makeJobsHref(1, tab)}
                className={`px-3 py-1.5 rounded border text-xs uppercase tracking-widest ${
                  source === tab
                    ? 'border-terminal-accent/40 bg-terminal-accent/10 text-terminal-accent'
                    : 'border-terminal-border text-terminal-muted hover:text-terminal-text hover:bg-white/5'
                }`}
              >
                {tab}
              </Link>
            ))}
          </div>
        </Card>

        {source === 'all' ? (
          <div className="space-y-6">
            <Card title="Remotive" badge={`${remotiveTotal} total`}>
              <JobListSection jobs={remotiveJobs} />
            </Card>

            <Card title="Arbeitnow" badge={`${arbeitnowTotal} total`}>
              <JobListSection jobs={arbeitnowJobs} />
            </Card>
          </div>
        ) : (
          <Card title={`${source} jobs`} badge={`${allTotal} total`}>
            <JobListSection jobs={filteredJobs} />
          </Card>
        )}

        <Card>
          <Pagination page={page} hasNext={hasNext} source={source} />
        </Card>
      </main>
    </>
  );
}
