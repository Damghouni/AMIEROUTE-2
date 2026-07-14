'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  User,
  Bike,
  Clock,
  Receipt,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Order, Driver, OrderStatus as OrderStatusType } from '@/types';
import { OrderStatus } from '@/components/client';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const mockOrder: Order = {
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
  deliveryAddress: { 
    id: 'a1', 
    street: '45 Rue de Rivoli', 
    city: 'Paris', 
    postalCode: '75001', 
    country: 'France' 
  },
  subtotal: 30,
  deliveryFee: 2.5,
  total: 32.5,
  paymentMethod: 'card',
  paymentStatus: 'paid',
  driverId: 'driver-1',
  driver: {
    id: 'driver-1',
    userId: 'user-driver-1',
    user: {
      id: 'user-driver-1',
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '06 12 34 56 78',
      role: 'driver',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    vehicleType: 'scooter',
    licensePlate: 'AB-123-CD',
    isAvailable: true,
    rating: 4.8,
    totalDeliveries: 1234,
  },
  estimatedDeliveryTime: '18:30',
  notes: 'Code: 1234, 3ème étage',
  createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

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

const getVehicleIcon = (type: Driver['vehicleType']) => {
  switch (type) {
    case 'bike':
      return '🚴';
    case 'scooter':
      return '🛵';
    case 'car':
      return '🚗';
    default:
      return '🚗';
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { status: realtimeStatus, driverLocation, isConnected } = useOrderTracking({
    orderId: params.id as string,
    initialStatus: order?.status,
    onStatusChange: (newStatus) => {
      if (order) {
        setOrder({ ...order, status: newStatus });
      }
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setOrder(mockOrder);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  useEffect(() => {
    if (order && realtimeStatus && realtimeStatus !== order.status) {
      setOrder({ ...order, status: realtimeStatus });
    }
  }, [realtimeStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h1>
        <p className="text-gray-600 mb-8">
          Cette commande n'existe pas ou a été supprimée
        </p>
        <Link href="/orders">
          <Button>Voir mes commandes</Button>
        </Link>
      </div>
    );
  }

  const isActiveOrder = !['delivered', 'cancelled'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux commandes
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande #{order.id}
          </h1>
          <p className="text-gray-500 mt-1">
            Passée le {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Wifi className="w-4 h-4" />
              En direct
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <WifiOff className="w-4 h-4" />
              Hors ligne
            </span>
          )}
        </div>
      </div>

      {isActiveOrder && (
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-6">Suivi de la commande</h2>
          <OrderStatus status={order.status} showTimeline />
          {order.estimatedDeliveryTime && order.status !== 'delivered' && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-primary-900">
                  Arrivée estimée: {order.estimatedDeliveryTime}
                </p>
                <p className="text-sm text-primary-700">
                  Votre commande arrive bientôt
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {order.driver && isActiveOrder && ['picked_up', 'delivering'].includes(order.status) && (
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Votre livreur</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              {order.driver.user?.avatar ? (
                <img
                  src={order.driver.user.avatar}
                  alt={order.driver.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">
                  {order.driver.user?.name || 'Livreur'}
                </h3>
                <span className="text-lg">{getVehicleIcon(order.driver.vehicleType)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span>⭐ {order.driver.rating.toFixed(1)}</span>
                <span>·</span>
                <span>{order.driver.totalDeliveries} livraisons</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${order.driver.user?.phone}`}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-600" />
              </a>
              <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-gray-900">Adresse de livraison</h2>
          </div>
          <p className="text-gray-700">{order.deliveryAddress.street}</p>
          <p className="text-gray-700">
            {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
          </p>
          {order.notes && (
            <p className="text-sm text-gray-500 mt-2">
              Note: {order.notes}
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            {order.store?.image ? (
              <img
                src={order.store.image}
                alt={order.store.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                🏪
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{order.store?.name}</h3>
              <p className="text-sm text-gray-500">{order.store?.phone}</p>
            </div>
          </div>
          <a
            href={`tel:${order.store?.phone}`}
            className="text-primary-600 text-sm hover:underline flex items-center gap-1"
          >
            <Phone className="w-4 h-4" />
            Contacter le restaurant
          </a>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Détails de la commande</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <div key={index} className="py-3 first:pt-0 flex justify-between">
              <div className="flex gap-3">
                <span className="text-gray-500">{item.quantity}x</span>
                <span className="text-gray-900">{item.productName}</span>
              </div>
              <span className="font-medium">{item.totalPrice.toFixed(2)} €</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span>{order.subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frais de livraison</span>
            <span>{order.deliveryFee === 0 ? 'Gratuit' : `${order.deliveryFee.toFixed(2)} €`}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{order.total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="capitalize">
              {order.paymentMethod === 'card' ? '💳 Carte bancaire' : 
               order.paymentMethod === 'cash' ? '💵 Espèces' : '👛 Portefeuille'}
            </span>
            <span>·</span>
            <span className={`${
              order.paymentStatus === 'paid' ? 'text-green-600' : 
              order.paymentStatus === 'refunded' ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {order.paymentStatus === 'paid' ? 'Payé' :
               order.paymentStatus === 'refunded' ? 'Remboursé' : 
               order.paymentStatus === 'pending' ? 'En attente' : 'Échoué'}
            </span>
          </div>
        </div>
      </Card>

      {order.status === 'delivered' && (
        <div className="mt-6 text-center">
          <Link href={`/stores/${order.storeId}`}>
            <Button variant="outline">Commander à nouveau</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
