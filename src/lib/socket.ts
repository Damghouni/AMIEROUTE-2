import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinUserRoom = (userId: string): void => {
  const s = getSocket();
  s.emit('join_user', userId);
};

export const joinStoreRoom = (storeId: string): void => {
  const s = getSocket();
  s.emit('join_store', storeId);
};

export const joinDriverRoom = (driverId: string): void => {
  const s = getSocket();
  s.emit('join_driver', driverId);
};

export const joinOrderRoom = (orderId: string): void => {
  const s = getSocket();
  s.emit('join_order', orderId);
};

export const emitDriverLocation = (data: { orderId: string; latitude: number; longitude: number }): void => {
  const s = getSocket();
  s.emit('driver_location', data);
};

export const emitOrderUpdate = (data: { orderId: string; status: string }): void => {
  const s = getSocket();
  s.emit('order:update', data);
};

export default socket;
