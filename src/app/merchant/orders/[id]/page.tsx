'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

const mockOrder = {
  id: '1a2b3c4d',
  date: '2024-01-15T10:30:00',
  status: 'pending' as OrderStatus,
  customer: {
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '06 12 34 56 78',
    address: '15 Rue de la Paix, 75002 Paris',
  },
  items: [
    { id: '1', name: 'Pizza Margherita', quantity: 2, price: 12.50 },
    { id: '2', name: 'Salade César', quantity: 1, price: 9.90 },
    { id: '3', name: 'Tiramisu', quantity: 2, price: 6.50 },
  ],
  subtotal: 47.90,
  deliveryFee: 2.50,
  total: 50.40,
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(mockOrder);
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Statut mis à jour: ${statusLabels[newStatus]}`);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande #{params.id?.toString().slice(0, 8)}
          </h1>
          <p className="text-gray-500">
            {new Date(order.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`ml-auto inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{order.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Frais de livraison</span>
                  <span>{order.deliveryFee.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {order.status === 'pending' && (
                  <Button
                    onClick={() => updateStatus('preparing')}
                    isLoading={isLoading}
                  >
                    Commencer la préparation
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    onClick={() => updateStatus('ready')}
                    isLoading={isLoading}
                  >
                    Marquer comme prêt
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    onClick={() => updateStatus('delivered')}
                    isLoading={isLoading}
                  >
                    Marquer comme livré
                  </Button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Button
                    variant="danger"
                    onClick={() => updateStatus('cancelled')}
                    isLoading={isLoading}
                  >
                    Annuler la commande
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">Client</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{order.customer.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{order.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-600">{order.customer.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
