'use client';

import { useState } from 'react';
import { MapPin, Phone, Store, User, Navigation, Package } from 'lucide-react';
import StatusButton from './StatusButton';

type DeliveryStatus = 'accepted' | 'arrived_store' | 'picked_up' | 'on_the_way' | 'delivered';

interface CurrentDeliveryProps {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: { name: string; quantity: number }[];
  currentStatus: DeliveryStatus;
  onStatusChange: (status: DeliveryStatus) => void;
}

export default function CurrentDelivery({
  id,
  storeName,
  storeAddress,
  storePhone,
  clientName,
  clientAddress,
  clientPhone,
  items,
  currentStatus,
  onStatusChange,
}: CurrentDeliveryProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: DeliveryStatus) => {
    setIsUpdating(true);
    await onStatusChange(status);
    setIsUpdating(false);
  };

  const getStatusStep = (status: DeliveryStatus): number => {
    const steps: Record<DeliveryStatus, number> = {
      accepted: 0,
      arrived_store: 1,
      picked_up: 2,
      on_the_way: 3,
      delivered: 4,
    };
    return steps[status];
  };

  const currentStep = getStatusStep(currentStatus);

  const statusButtons: { status: DeliveryStatus; label: string }[] = [
    { status: 'arrived_store', label: 'Arrivé au magasin' },
    { status: 'picked_up', label: 'Commande récupérée' },
    { status: 'on_the_way', label: 'En route vers client' },
    { status: 'delivered', label: 'Livré' },
  ];

  return (
    <div className="space-y-4">
      {/* Store Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{storeName}</h3>
              <p className="text-sm text-gray-500">Récupération</p>
            </div>
          </div>
          <a
            href={`tel:${storePhone}`}
            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Phone className="w-5 h-5 text-green-600" />
          </a>
        </div>
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-700">{storeAddress}</p>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
        >
          <Navigation className="w-4 h-4" />
          Naviguer
        </a>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-gray-400" />
          <h4 className="font-medium text-gray-900">Articles à récupérer</h4>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-500">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Client Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{clientName}</h3>
              <p className="text-sm text-gray-500">Livraison</p>
            </div>
          </div>
          <a
            href={`tel:${clientPhone}`}
            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Phone className="w-5 h-5 text-green-600" />
          </a>
        </div>
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-700">{clientAddress}</p>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(clientAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
        >
          <Navigation className="w-4 h-4" />
          Naviguer
        </a>
      </div>

      {/* Status Buttons */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h4 className="font-medium text-gray-900 mb-3">Statut de la livraison</h4>
        <div className="space-y-2">
          {statusButtons.map((btn, index) => {
            const btnStep = index + 1;
            let status: 'pending' | 'active' | 'completed' = 'pending';
            if (btnStep < currentStep) status = 'completed';
            else if (btnStep === currentStep) status = 'active';

            return (
              <StatusButton
                key={btn.status}
                status={status}
                isLoading={isUpdating && status === 'active'}
                onClick={() => handleStatusChange(btn.status)}
              >
                {btn.label}
              </StatusButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
