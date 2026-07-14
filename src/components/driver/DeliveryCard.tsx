'use client';

import { MapPin, Clock, Store, Euro } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DeliveryCardProps {
  id: string;
  storeName: string;
  storeAddress: string;
  clientAddress: string;
  distance: number;
  estimatedTime: number;
  amount: number;
  itemCount: number;
  onAccept: (id: string) => void;
  isLoading?: boolean;
}

export default function DeliveryCard({
  id,
  storeName,
  storeAddress,
  clientAddress,
  distance,
  estimatedTime,
  amount,
  itemCount,
  onAccept,
  isLoading = false,
}: DeliveryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{storeName}</h3>
              <p className="text-xs text-gray-500">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{amount.toFixed(2)} €</p>
            <p className="text-xs text-gray-500">gain estimé</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Récupération</p>
              <p className="text-sm text-gray-900">{storeAddress}</p>
            </div>
          </div>
          <div className="ml-2.5 w-px h-4 bg-gray-200" />
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Livraison</p>
              <p className="text-sm text-gray-900">{clientAddress}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 py-2 px-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{distance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">~{estimatedTime} min</span>
          </div>
        </div>

        <Button
          fullWidth
          onClick={() => onAccept(id)}
          isLoading={isLoading}
        >
          Accepter la course
        </Button>
      </div>
    </div>
  );
}
