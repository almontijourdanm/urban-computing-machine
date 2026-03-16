-- ────────────────────────────────────────────────────────────
-- Job Radar — PostgreSQL Schema
-- Applied automatically by Docker Compose on first run
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id           VARCHAR(255)  PRIMARY KEY,
  title        VARCHAR(500)  NOT NULL,
  company      VARCHAR(255)  NOT NULL,
  skills       JSONB         NOT NULL DEFAULT '[]',
  salary       VARCHAR(255),
  location     VARCHAR(255),
  source       VARCHAR(50)   NOT NULL,
  url          TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  ingested_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_ingested_at ON jobs (ingested_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_source     ON jobs (source);
CREATE INDEX IF NOT EXISTS idx_jobs_skills     ON jobs USING gin (skills);
CREATE INDEX IF NOT EXISTS idx_jobs_company    ON jobs (company);
