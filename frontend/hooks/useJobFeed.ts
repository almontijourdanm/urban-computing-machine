'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../services/socket';
import type { Job } from '../types';

const MAX_FEED_SIZE = 50;

export function useJobFeed(initialJobs: Job[] = []) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const addJob = useCallback((job: Job) => {
    setJobs((prev) => {
      // Deduplicate on the client side
      if (prev.some((j) => j.id === job.id)) return prev;
      return [job, ...prev].slice(0, MAX_FEED_SIZE);
    });
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('new_job', addJob);
    return () => { socket.off('new_job', addJob); };
  }, [addJob]);

  return { jobs };
}
