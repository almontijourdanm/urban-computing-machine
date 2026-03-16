'use client';

import { useJobFeed } from '../../hooks/useJobFeed';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import type { Job } from '../../types';

interface LiveJobFeedProps {
  initialJobs: Job[];
}

export function LiveJobFeed({ initialJobs }: LiveJobFeedProps) {
  const { jobs } = useJobFeed(initialJobs);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-terminal-muted">
        <span className="text-2xl mb-2">◌</span>
        <p className="text-sm">Waiting for live jobs…</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[570px] overflow-y-auto pr-1">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} isNew={index === 0} />
      ))}
    </div>
  );
}

function JobCard({ job, isNew }: { job: Job; isNew: boolean }) {
  return (
    <div
      className={`p-3 rounded border transition-colors ${
        isNew
          ? 'border-terminal-accent/40 bg-terminal-accent/5 slide-in'
          : 'border-terminal-border bg-white/[0.02] hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-terminal-text hover:text-terminal-accent transition-colors line-clamp-1"
          >
            {job.title}
          </a>
          <p className="text-xs text-terminal-muted mt-0.5 truncate">{job.company}</p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge variant={job.source === 'remotive' ? 'accent' : 'green'}>
            {job.source}
          </Badge>
          <span className="text-xs text-terminal-muted">
            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-xs px-1.5 py-0.5 rounded bg-terminal-accent/5 text-terminal-accent/80 border border-terminal-accent/10"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-xs text-terminal-muted self-center">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-terminal-muted truncate">{job.location}</span>
        {job.salary && (
          <span className="text-xs text-terminal-green flex-shrink-0">{job.salary}</span>
        )}
      </div>
    </div>
  );
}
