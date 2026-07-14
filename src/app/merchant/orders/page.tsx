import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

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
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


// Rooms

export const joinUserRoom = (userId: string): void => {
  getSocket().emit('join_user', userId);
};


export const joinStoreRoom = (storeId: string): void => {
  getSocket().emit('join_store', storeId);
};


export const joinDriverRoom = (driverId: string): void => {
  getSocket().emit('join_driver', driverId);
};


export const joinOrderRoom = (orderId: string): void => {
  getSocket().emit('join_order', orderId);
};


// Driver location

export const emitDriverLocation = (data: {
  orderId: string;
  latitude: number;
  longitude: number;
}): void => {
  getSocket().emit('driver_location', data);
};


// Update order status

export const emitOrderUpdate = (data: {
  orderId: string;
  status: string;
}): void => {
  getSocket().emit('order:update', data);
};


// Receive order updates

export const onOrderUpdated = (
  callback: (data: unknown) => void
): void => {
  getSocket().on('order:updated', callback);
};


// Receive driver location

export const onDriverLocation = (
  callback: (data: unknown) => void
): void => {
  getSocket().on('driver_location_updated', callback);
};


// Remove listener

export const removeSocketListener = (
  event: string
): void => {
  getSocket().off(event);
};