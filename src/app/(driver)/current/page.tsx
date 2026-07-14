'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { CurrentDelivery } from '@/components/driver';
import { useSocket } from '@/hooks/useSocket';
import { emitOrderUpdate, emitDriverLocation } from '@/lib/socket';

type DeliveryStatus = 'accepted' | 'arrived_store' | 'picked_up' | 'on_the_way' | 'delivered';

const statusToOrderStatus: Record<DeliveryStatus, string> = {
  accepted: 'confirmed',
  arrived_store: 'ready_for_pickup',
  picked_up: 'picked_up',
  on_the_way: 'delivering',
  delivered: 'delivered',
};

const mockCurrentDelivery = {
  id: '1',
  storeName: 'Carrefour Market',
  storeAddress: '12 Rue de la Paix, 75002 Paris',
  storePhone: '+33 1 42 61 00 00',
  clientName: 'Marie Dupont',
  clientAddress: '45 Avenue des Champs-Élysées, 75008 Paris',
  clientPhone: '+33 6 12 34 56 78',
  items: [
    { name: 'Lait demi-écrémé 1L', quantity: 2 },
    { name: 'Pain de mie', quantity: 1 },
    { name: 'Beurre doux 250g', quantity: 1 },
    { name: 'Oeufs frais x6', quantity: 1 },
  ],
  currentStatus: 'accepted' as DeliveryStatus,
};

export default function CurrentPage() {
  const router = useRouter();
  const [delivery, setDelivery] = useState<typeof mockCurrentDelivery | null>(mockCurrentDelivery);
  const { isConnected } = useSocket({ driverId: 'driver-1' });

  useEffect(() => {
    if (!delivery || !isConnected) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        emitDriverLocation({
          orderId: delivery.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [delivery, isConnected]);

  const handleStatusChange = async (status: DeliveryStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (delivery) {
      emitOrderUpdate({
        orderId: delivery.id,
        status: statusToOrderStatus[status],
      });
      toast.success(`Statut mis à jour: ${status}`);
    }

    if (status === 'delivered') {
      setDelivery(null);
      router.push('/history');
    } else if (delivery) {
      setDelivery({ ...delivery, currentStatus: status });
    }
  };

  if (!delivery) {
    return (
      <div className="px-4 py-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Aucune livraison en cours</h2>
          <p className="text-sm text-gray-500 mb-4">Acceptez une course pour commencer</p>
          <button
            onClick={() => router.push('/available')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
          >
            Voir les courses disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Livraison en cours</h1>
        <p className="text-sm text-gray-500">Commande #{delivery.id}</p>
      </div>

      <CurrentDelivery
        {...delivery}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
