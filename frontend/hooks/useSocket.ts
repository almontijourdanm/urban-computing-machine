'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '../services/socket';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect    = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect',    onConnect);
    socket.on('disconnect', onDisconnect);

    // Sync with current state (socket may already be connected)
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect',    onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected };
}
