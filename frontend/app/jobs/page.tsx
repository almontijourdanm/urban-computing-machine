import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api, Job } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

export default async function JobsPage() {
  let jobs: Array<Job> = [];
  let total = 0;

  try {
    const result = await api.getJobs(1, 50);
    jobs = result.jobs;
    total = result.total;
  } catch {
    // Backend offline — render empty state
  }

  return (
    <>
      <Header title="Job Listings" />
      <main className="flex-1 overflow-y-auto p-6">
        <Card title="All Jobs" badge={`${total} total`}>
          <div className="space-y-2">
            {jobs.length === 0 ? (
              <p className="text-center py-12 text-terminal-muted text-sm">
                No jobs yet — start the backend to begin collecting.
              </p>
            ) : (
              jobs.map((job) => (
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
                      <span className="text-xs text-terminal-muted">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </>
  );
}
