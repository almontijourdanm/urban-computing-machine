# Realtime Developer Job Market Radar

A Bloomberg Terminal-style analytics dashboard for developer job markets.  
Streams live job data from public APIs and visualises skill demand, salary trends, and job distributions in real-time.

```
┌─────────────────────────────────────────────────────────────┐
│                  Browser  (Next.js 15)                      │
│  Live Feed (WS)  │  Skills Chart  │  Salary Trends          │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP + WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│              Backend  (Express + Socket.io)                 │
│  Collectors ──► BullMQ Queue ──► Worker ──► REST API        │
│  (Remotive)      (Redis)       (pg store    /api/analytics  │
│  (Arbeitnow)                    + emit WS)  /api/jobs       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │   PostgreSQL    │
                  │  jobs (JSONB)   │
                  └─────────────────┘
```

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 15 (App Router) · TypeScript · TailwindCSS · Recharts · Socket.io-client |
| Backend    | Node.js · Express · TypeScript · Socket.io · BullMQ    |
| Queue      | BullMQ + Redis                                          |
| Database   | PostgreSQL (JSONB skills column, GIN index)             |
| Data       | Remotive API · Arbeitnow API (free, no key required)    |

---

## Quick Start

### 1 — Prerequisites

- **Node.js 20+**
- **Docker & Docker Compose**
- `npm` / `pnpm` / `yarn`

### 2 — Start infrastructure

```bash
docker compose up -d
```

Starts **PostgreSQL** on `:5432` and **Redis** on `:6379`.  
The schema is applied automatically on first boot.

### 3 — Configure environment

```bash
# Copy root example (reference only)
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

### 4 — Start the backend

```bash
cd backend
npm install
npm run dev
```

Runs at **http://localhost:3001**

### 5 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:3000**

---

## Project Structure

```
urban-computing-machine/
├── docker-compose.yml          # PostgreSQL + Redis
├── .env.example
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts            # App entry point
│       ├── config/             # Typed env config
│       ├── db/                 # pg Pool + schema.sql
│       ├── collectors/         # Remotive + Arbeitnow fetchers
│       ├── queues/             # BullMQ queue definition
│       ├── workers/            # BullMQ worker (store + emit)
│       ├── services/           # analytics.service, job.service
│       ├── controllers/        # analytics, jobs
│       ├── routes/             # /api/analytics, /api/jobs
│       ├── socket/             # Socket.io init + emit helpers
│       └── types/              # Shared TypeScript interfaces
│
└── frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    └── app/                    # Next.js App Router
        ├── layout.tsx
        ├── page.tsx            # Dashboard
        ├── jobs/page.tsx
        ├── skills/page.tsx
        ├── trends/page.tsx
        ├── components/
        │   ├── layout/         # Sidebar, Header
        │   ├── dashboard/      # LiveJobFeed, TopSkillsChart,
        │   │                   # SalaryTrendChart, LocationChart,
        │   │                   # StatsCards
        │   └── ui/             # Card, Badge
        ├── hooks/              # useSocket, useJobFeed, useAnalytics
        ├── services/           # api.ts, socket.ts
        └── types/              # Frontend TypeScript types
```

---

## API Reference

| Method | Path                          | Description                          |
|--------|-------------------------------|--------------------------------------|
| GET    | `/api/analytics/top-skills`   | Most demanded skills (aggregated)    |
| GET    | `/api/analytics/salary-trends`| Daily avg salary + job count (30 d)  |
| GET    | `/api/analytics/job-locations`| Job count per location               |
| GET    | `/api/analytics/job-count`    | KPIs: today's jobs, top company, remote % |
| GET    | `/api/jobs`                   | Paginated job list (`?page=&pageSize=&source=`) |
| GET    | `/health`                     | Health check                         |

## WebSocket Events

| Event                  | Direction        | Payload            |
|------------------------|------------------|--------------------|
| `new_job`              | Server → Client  | `NormalizedJob`    |
| `skill_stats_updated`  | Server → Client  | `TopSkill[]`       |
| `salary_stats_updated` | Server → Client  | `SalaryTrend[]`    |

## Data Sources

| API        | URL                                        | Auth     |
|------------|--------------------------------------------|----------|
| Remotive   | `https://remotive.io/api/remote-jobs`      | None     |
| Arbeitnow  | `https://arbeitnow.com/api/job-board-api`  | None     |

Jobs are collected every **60 seconds** (set `COLLECTOR_INTERVAL_MS` to change).

---

## Environment Variables

| Variable                 | Default                   | Description                       |
|--------------------------|---------------------------|-----------------------------------|
| `PORT`                   | `3001`                    | Backend HTTP port                 |
| `NODE_ENV`               | `development`             |                                   |
| `POSTGRES_HOST`          | `localhost`               |                                   |
| `POSTGRES_PORT`          | `5432`                    |                                   |
| `POSTGRES_DB`            | `job_radar`               |                                   |
| `POSTGRES_USER`          | `postgres`                |                                   |
| `POSTGRES_PASSWORD`      | `postgres`                |                                   |
| `REDIS_HOST`             | `localhost`               |                                   |
| `REDIS_PORT`             | `6379`                    |                                   |
| `COLLECTOR_INTERVAL_MS`  | `60000`                   | Polling interval (ms)             |
| `FRONTEND_URL`           | `http://localhost:3000`   | CORS allow-list                   |
| `NEXT_PUBLIC_API_URL`    | `http://localhost:3001`   | REST base URL (browser)           |
| `NEXT_PUBLIC_WS_URL`     | `http://localhost:3001`   | WebSocket URL (browser)           |

