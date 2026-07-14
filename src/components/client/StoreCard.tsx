'use client';

import Link from 'next/link';
import { Star, Clock, MapPin } from 'lucide-react';
import { Store } from '@/types';
import Card from '@/components/ui/Card';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  const storeId = (store as any).id || (store as any)._id;
  return (
    <Link href={`/stores/${storeId}`}>
      <Card hoverable padding="none" className="overflow-hidden h-full">
        <div className="relative h-40 bg-gray-200">
          {store.image ? (
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-4xl">🏪</span>
            </div>
          )}
          {!store.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Fermé</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{store.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {/* <span className="font-medium">{typeof store.rating === 'number' ? store.rating.toFixed(1) : (store.rating?.average || 0).toFixed(1)}</span> */}
              <span className="text-gray-400">({store.reviewCount})</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {(store.categories || []).slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{store.estimatedDeliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Livraison {store.deliveryFee === 0 ? 'gratuite' : `${store.deliveryFee.toFixed(2)} €`}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
