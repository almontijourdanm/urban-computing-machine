import { fetchRemotiveJobs } from './remotive.collector';
import { fetchArbeitnowJobs } from './arbeitnow.collector';
import { enqueueJob } from '../queues/job.queue';
import { NormalizedJob } from '../types';

export async function collectAllJobs(): Promise<void> {
  console.log('[Collector] Polling external APIs...');

  const results = await Promise.allSettled([fetchRemotiveJobs(), fetchArbeitnowJobs()]);

  const allJobs: NormalizedJob[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value);
    } else {
      console.warn('[Collector] A source failed:', result.reason?.message);
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
