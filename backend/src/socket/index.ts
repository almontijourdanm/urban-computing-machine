import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NormalizedJob, TopSkill } from '../types';

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HttpServer, frontendUrl: string): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected    ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected ${socket.id}`);
    });
  });

  return io;
}

// ── Emit helpers (no-op when socket is uninitialised) ─────────

export function emitNewJob(job: NormalizedJob): void {
  io?.emit('new_job', job);
}

export function emitSkillStatsUpdated(stats: TopSkill[]): void {
  io?.emit('skill_stats_updated', stats);
}

export function emitSalaryStatsUpdated(stats: unknown): void {
  io?.emit('salary_stats_updated', stats);
}
