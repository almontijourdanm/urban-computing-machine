import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool({
  host: config.postgres.host,
  port: config.postgres.port,
  database: config.postgres.database,
  user: config.postgres.user,
  password: config.postgres.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err);
});

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id           VARCHAR(255)  PRIMARY KEY,
        title        VARCHAR(500)  NOT NULL,
        company      VARCHAR(255)  NOT NULL,
        skills       JSONB         NOT NULL DEFAULT '[]',
        salary       VARCHAR(255),
        location     VARCHAR(255),
        source       VARCHAR(50)   NOT NULL,
        url          TEXT,
        created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_jobs_source     ON jobs (source);
      CREATE INDEX IF NOT EXISTS idx_jobs_skills     ON jobs USING gin (skills);
      CREATE INDEX IF NOT EXISTS idx_jobs_company    ON jobs (company);
    `);
    console.log('[DB] Schema initialised');
  } finally {
    client.release();
  }
}
