'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getSocket, connectSocket, joinOrderRoom, emitOrderUpdate } from '@/lib/socket';
import { OrderStatus } from '@/types';

interface DriverLocation {
  latitude: number;
  longitude: number;
}

interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  driverId?: string;
  estimatedDeliveryTime?: string;
}

interface UseOrderTrackingOptions {
  orderId: string;
  initialStatus?: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
}

interface UseOrderTrackingReturn {
  status: OrderStatus;
  driverLocation: DriverLocation | null;
  isConnected: boolean;
  updateStatus: (newStatus: OrderStatus) => void;
}

const statusMessages: Record<OrderStatus, string> = {
  pending: 'Commande en attente de confirmation',
  confirmed: 'Commande confirmée par le restaurant',
  preparing: 'Votre commande est en préparation',
  ready_for_pickup: 'Commande prête, en attente du livreur',
  picked_up: 'Le livreur a récupéré votre commande',
  delivering: 'Votre commande est en route',
  delivered: 'Commande livrée',
  cancelled: 'Commande annulée',
};

export function useOrderTracking(options: UseOrderTrackingOptions): UseOrderTrackingReturn {
  const { orderId, initialStatus = 'pending', onStatusChange } = options;
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const updateStatus = useCallback((newStatus: OrderStatus) => {
    emitOrderUpdate({ orderId, status: newStatus });
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    
    const handleConnect = () => {
      setIsConnected(true);
      joinOrderRoom(orderId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleStatusUpdate = (data: OrderStatusUpdate) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
        onStatusChange?.(data.status);
        
        const message = statusMessages[data.status];
        if (message) {
          if (data.status === 'cancelled') {
            toast.error(message);
          } else if (data.status === 'delivered') {
            toast.success(message, { icon: '🎉' });
          } else {
            toast(message, { icon: '📦' });
          }
        }
      }
    };

    const handleDriverLocation = (data: { orderId: string; latitude: number; longitude: number }) => {
      if (data.orderId === orderId) {
        setDriverLocation({ latitude: data.latitude, longitude: data.longitude });
      }
    };

    const handleOrderAssigned = (data: { orderId: string; driverId: string }) => {
      if (data.orderId === orderId) {
        toast('Un livreur a accepté votre commande', { icon: '🚴' });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('order:status', handleStatusUpdate);
    socket.on('order:updated', handleStatusUpdate);
    socket.on('driver_location_updated', handleDriverLocation);
    socket.on('order:assigned', handleOrderAssigned);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('order:status', handleStatusUpdate);
      socket.off('order:updated', handleStatusUpdate);
      socket.off('driver_location_updated', handleDriverLocation);
      socket.off('order:assigned', handleOrderAssigned);
    };
  }, [orderId, onStatusChange]);

  return { status, driverLocation, isConnected, updateStatus };
}

export default useOrderTracking;
