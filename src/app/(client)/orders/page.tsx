'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, ChevronRight, Calendar } from 'lucide-react';
import { Order } from '@/types';
import { OrderStatus } from '@/components/client';
import Card from '@/components/ui/Card';

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    storeId: '1',
    store: {
      id: '1',
      name: 'Pizza Roma',
      image: '/images/pizza-store.jpg',
      address: { id: '1', street: '12 Rue de Rome', city: 'Paris', postalCode: '75001', country: 'France' },
      phone: '01 23 45 67 89',
      email: 'contact@pizzaroma.fr',
      rating: 4.5,
      reviewCount: 234,
      isOpen: true,
      openingHours: [],
      categories: ['Pizza', 'Italien'],
      deliveryFee: 2.5,
      minOrderAmount: 15,
      estimatedDeliveryTime: '25-35 min',
      createdAt: new Date().toISOString(),
    },
    items: [
      { productId: 'p1', productName: 'Pizza Margherita', quantity: 2, unitPrice: 12.5, totalPrice: 25 },
      { productId: 'p7', productName: 'Coca-Cola 33cl', quantity: 2, unitPrice: 2.5, totalPrice: 5 },
    ],
    status: 'delivering',
    deliveryAddress: { id: 'a1', street: '45 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'France' },
    subtotal: 30,
    deliveryFee: 2.5,
    total: 32.5,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    estimatedDeliveryTime: '18:30',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    userId: 'user-1',
    storeId: '2',
    store: {
      id: '2',
      name: 'Sushi Master',
      image: '/images/sushi-store.jpg',
      address: { id: '2', street: '45 Avenue de Tokyo', city: 'Paris', postalCode: '75008', country: 'France' },
      phone: '01 98 76 54 32',
      email: 'contact@sushimaster.fr',
      rating: 4.8,
      reviewCount: 456,
      isOpen: true,
      openingHours: [],
      categories: ['Sushi', 'Japonais'],
      deliveryFee: 3,
      minOrderAmount: 20,
      estimatedDeliveryTime: '30-40 min',
      createdAt: new Date().toISOString(),
    },
    items: [
      { productId: 's1', productName: 'Menu Sushi 18 pièces', quantity: 1, unitPrice: 24, totalPrice: 24 },
    ],
    status: 'delivered',
    deliveryAddress: { id: 'a1', street: '45 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'France' },
    subtotal: 24,
    deliveryFee: 3,
    total: 27,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    actualDeliveryTime: '2024-01-15T19:45:00Z',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-003',
    userId: 'user-1',
    storeId: '3',
    store: {
      id: '3',
      name: 'Burger Factory',
      image: '/images/burger-store.jpg',
      address: { id: '3', street: '78 Boulevard Haussmann', city: 'Paris', postalCode: '75009', country: 'France' },
      phone: '01 11 22 33 44',
      email: 'contact@burgerfactory.fr',
      rating: 4.3,
      reviewCount: 189,
      isOpen: true,
      openingHours: [],
      categories: ['Burger', 'Américain'],
      deliveryFee: 0,
      minOrderAmount: 12,
      estimatedDeliveryTime: '20-30 min',
      createdAt: new Date().toISOString(),
    },
    items: [
      { productId: 'b1', productName: 'Classic Burger', quantity: 1, unitPrice: 11, totalPrice: 11 },
      { productId: 'b2', productName: 'Frites maison', quantity: 1, unitPrice: 4.5, totalPrice: 4.5 },
    ],
    status: 'cancelled',
    deliveryAddress: { id: 'a1', street: '45 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'France' },
    subtotal: 15.5,
    deliveryFee: 0,
    total: 15.5,
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);

  const activeOrders = orders.filter((o) => 
    !['delivered', 'cancelled'].includes(o.status)
  );
  
  const pastOrders = orders.filter((o) => 
    ['delivered', 'cancelled'].includes(o.status)
  );

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ClipboardList className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h1>
        <p className="text-gray-600 mb-8">
          Vous n'avez pas encore passé de commande
        </p>
        <Link href="/stores">
          <button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Découvrir les restaurants
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mes commandes</h1>

      {activeOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">En cours</h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card hoverable className="block">
                  <div className="flex items-start gap-4">
                    {order.store?.image ? (
                      <img
                        src={order.store.image}
                        alt={order.store.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        🏪
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.store?.name || 'Restaurant'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''} · {order.total.toFixed(2)} €
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="mt-3">
                        <OrderStatus status={order.status} />
                      </div>
                      {order.estimatedDeliveryTime && (
                        <p className="text-sm text-primary-600 mt-2">
                          Arrivée estimée: {order.estimatedDeliveryTime}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card hoverable className="block">
                  <div className="flex items-start gap-4">
                    {order.store?.image ? (
                      <img
                        src={order.store.image}
                        alt={order.store.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        🏪
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.store?.name || 'Restaurant'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''} · {order.total.toFixed(2)} €
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <OrderStatus status={order.status} />
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
