import { fetchRemotiveJobs } from './remotive.collector';
import { fetchArbeitnowJobs } from './arbeitnow.collector';
import { enqueueJob } from '../queues/job.queue';
import { NormalizedJob } from '../types';

type SourceResult = {
  source: 'remotive' | 'arbeitnow';
  jobs: NormalizedJob[];
};

export async function collectAllJobs(): Promise<void> {
  console.log('[Collector] Polling external APIs...');

  const results = await Promise.allSettled<SourceResult>([
    fetchRemotiveJobs().then((jobs) => ({ source: 'remotive' as const, jobs })),
    fetchArbeitnowJobs().then((jobs) => ({ source: 'arbeitnow' as const, jobs })),
  ]);

  const allJobs: NormalizedJob[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value.jobs);
    } else {
      const source = result.reason?.config?.url?.includes('arbeitnow')
        ? 'arbeitnow'
        : 'remotive';
      const status = result.reason?.response?.status;
      const code = result.reason?.code;
      const message = result.reason?.message || 'Unknown collector error';
      console.warn(
        `[Collector] Source failed (${source})${status ? ` status=${status}` : ''}${code ? ` code=${code}` : ''}: ${message}`
      );
    }
  }

  console.log(`[Collector] Collected ${allJobs.length} jobs — enqueueing...`);

  let enqueued = 0;
  for (const job of allJobs) {
    try {
      await enqueueJob(job);
      enqueued++;
    } catch {
      // Duplicate job IDs are ignored by BullMQ; suppress noise
    }
  }

  console.log(`[Collector] Enqueued ${enqueued} new jobs`);
}

export function startCollector(intervalMs: number): NodeJS.Timeout {
  collectAllJobs(); // run immediately on startup
  return setInterval(collectAllJobs, intervalMs);
}
