'use client';

import { Check, Clock, ChefHat, Package, Truck, Home, X } from 'lucide-react';
import { OrderStatus as OrderStatusType } from '@/types';

interface OrderStatusProps {
  status: OrderStatusType;
  showTimeline?: boolean;
}

const statusConfig: Record<OrderStatusType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  confirmed: {
    label: 'Confirmée',
    icon: Check,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  preparing: {
    label: 'En préparation',
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  ready_for_pickup: {
    label: 'Prête',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  picked_up: {
    label: 'Récupérée',
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  delivering: {
    label: 'En livraison',
    icon: Truck,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  delivered: {
    label: 'Livrée',
    icon: Home,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  cancelled: {
    label: 'Annulée',
    icon: X,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

const statusOrder: OrderStatusType[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'picked_up',
  'delivering',
  'delivered',
];

export default function OrderStatus({ status, showTimeline = false }: OrderStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (!showTimeline) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-lg font-semibold text-red-600">Commande annulée</p>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="relative">
      <div className="flex justify-between">
        {statusOrder.map((s, index) => {
          const stepConfig = statusConfig[s];
          const StepIcon = stepConfig.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={s}
              className="flex flex-col items-center relative z-10"
              style={{ flex: 1 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? `${stepConfig.bgColor} ${stepConfig.color}`
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'
                }`}
              >
                {stepConfig.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{
            width: `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
