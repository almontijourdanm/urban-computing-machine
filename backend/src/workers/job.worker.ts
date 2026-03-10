import { Worker, Job } from 'bullmq';
import { config } from '../config';
import { pool } from '../db';
import { NormalizedJob } from '../types';
import { emitNewJob, emitSkillStatsUpdated } from '../socket';
import { getTopSkills } from '../services/analytics.service';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
};

async function processJob(job: Job<NormalizedJob>): Promise<void> {
  const data = job.data;

  const result = await pool.query<{ id: string }>(
    `INSERT INTO jobs (id, title, company, skills, salary, location, source, url, created_at)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [
      data.id,
      data.title,
      data.company,
      JSON.stringify(data.skills),
      data.salary,
      data.location,
      data.source,
      data.url,
      data.created_at,
    ]
  );

  if (!result.rowCount || result.rowCount === 0) return; // already existed

  console.log(`[Worker] Stored: "${data.title}" @ ${data.company}`);

  // Broadcast new job to all connected dashboard clients
  emitNewJob(data);

  // Refresh skill stats every 10 stored jobs
  const { rows } = await pool.query<{ count: string }>('SELECT COUNT(*) FROM jobs');
  if (parseInt(rows[0].count, 10) % 10 === 0) {
    const topSkills = await getTopSkills(20);
    emitSkillStatsUpdated(topSkills);
  }
}

export function startWorker(): Worker<NormalizedJob> {
  const worker = new Worker<NormalizedJob>('job-processing', processJob, {
    connection,
    concurrency: 5,
  });

  worker.on('completed', (job) => console.log(`[Worker] Done: ${job.id}`));
  worker.on('failed', (job, err) =>
    console.error(`[Worker] Failed: ${job?.id} — ${err.message}`)
  );

  return worker;
}
