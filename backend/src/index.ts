import 'dotenv/config';
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { initializeDatabase } from './db';
import { initializeSocket } from './socket';
import { startWorker } from './workers/job.worker';
// import { startCollector } from './collectors';
import { startCollector } from './collectors/index';
// import routes from './routes';
import routes from './routes';

async function bootstrap(): Promise<void> {
  await initializeDatabase();

  const app = express();

  // ── Middleware ─────────────────────────────────────────────
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );
  app.use(express.json());

  // ── Health check ───────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── API routes ─────────────────────────────────────────────
  app.use('/api', routes);

  // ── Global error handler ───────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  // ── HTTP + Socket.io ───────────────────────────────────────
  const httpServer = http.createServer(app);
  initializeSocket(httpServer, config.frontendUrl);

  // ── Background services ────────────────────────────────────
  startWorker();
  startCollector(config.collectors.intervalMs);

  httpServer.listen(config.port, () => {
    console.log(`[Server] http://localhost:${config.port}  (${config.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[Fatal]', err);
  process.exit(1);
});
