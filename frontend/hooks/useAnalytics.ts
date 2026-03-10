'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../services/socket';
import type { TopSkill } from '../types';

export function useSkillStats(initialStats: TopSkill[] = []) {
  const [skills, setSkills] = useState<TopSkill[]>(initialStats);

  const handleUpdate = useCallback((stats: TopSkill[]) => {
    setSkills(stats);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('skill_stats_updated', handleUpdate);
    return () => { socket.off('skill_stats_updated', handleUpdate); };
  }, [handleUpdate]);

  return { skills };
}
