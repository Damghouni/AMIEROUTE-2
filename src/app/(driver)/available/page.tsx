'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DeliveryCard } from '@/components/driver';

const mockDeliveries = [
  {
    id: '1',
    storeName: 'Carrefour Market',
    storeAddress: '12 Rue de la Paix, 75002 Paris',
    clientAddress: '45 Avenue des Champs-Élysées, 75008 Paris',
    distance: 3.2,
    estimatedTime: 15,
    amount: 5.50,
    itemCount: 4,
  },
  {
    id: '2',
    storeName: 'Pharmacie Centrale',
    storeAddress: '8 Boulevard Haussmann, 75009 Paris',
    clientAddress: '23 Rue du Faubourg Saint-Honoré, 75008 Paris',
    distance: 1.8,
    estimatedTime: 10,
    amount: 4.20,
    itemCount: 2,
  },
  {
    id: '3',
    storeName: 'Boulangerie Paul',
    storeAddress: '156 Rue de Rivoli, 75001 Paris',
    clientAddress: '78 Boulevard Saint-Germain, 75005 Paris',
    distance: 2.5,
    estimatedTime: 12,
    amount: 3.80,
    itemCount: 3,
  },
];

export default function AvailablePage() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAccept = async (id: string) => {
    setLoadingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    setLoadingId(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Commandes disponibles</h1>
          <p className="text-sm text-gray-500">{deliveries.length} course{deliveries.length > 1 ? 's' : ''} à proximité</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Aucune course disponible</h2>
          <p className="text-sm text-gray-500">Les nouvelles courses apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              {...delivery}
              onAccept={handleAccept}
              isLoading={loadingId === delivery.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
