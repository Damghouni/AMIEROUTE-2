'use client';

import { useEffect, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket, joinUserRoom, joinDriverRoom, joinStoreRoom } from '@/lib/socket';

interface UseSocketOptions {
  userId?: string;
  driverId?: string;
  storeId?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { userId, driverId, storeId, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = useCallback(() => {
    const s = connectSocket();
    setSocket(s);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    const handleConnect = () => {
      setIsConnected(true);
      if (userId) joinUserRoom(userId);
      if (driverId) joinDriverRoom(driverId);
      if (storeId) joinStoreRoom(storeId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);

    if (autoConnect) {
      connect();
    }

    if (s.connected) {
      handleConnect();
    }

    return () => {
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
    };
  }, [userId, driverId, storeId, autoConnect, connect]);

  return { socket, isConnected, connect, disconnect };
}

export default useSocket;
