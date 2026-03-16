import { Queue } from 'bullmq';
import { config } from '../config';
import { NormalizedJob } from '../types';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
};

export const jobQueue = new Queue<NormalizedJob>('job-processing', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 50 },
  },
});

/**
 * Enqueue a normalised job.
 * Using a deterministic jobId lets BullMQ deduplicate within the same cycle
 * (any job already in the queue/active is skipped automatically).
 */
export async function enqueueJob(job: NormalizedJob): Promise<void> {
  await jobQueue.add('process-job', job, {
    jobId: `job:${job.source}:${job.id}`,
  });
}
