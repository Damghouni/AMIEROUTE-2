'use client';

import { useState } from 'react';
import { ShoppingCart, Euro, Package, TrendingUp } from 'lucide-react';
import { StatsCard, OrderTable } from '@/components/merchant';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: OrderStatus;
}

const mockOrders: Order[] = [
  { id: '1a2b3c4d', date: '2024-01-15T10:30:00', customer: 'Marie Martin', total: 45.50, status: 'pending' },
  { id: '2b3c4d5e', date: '2024-01-15T09:15:00', customer: 'Pierre Durand', total: 32.00, status: 'preparing' },
  { id: '3c4d5e6f', date: '2024-01-15T08:45:00', customer: 'Sophie Leroy', total: 28.90, status: 'ready' },
  { id: '4d5e6f7g', date: '2024-01-14T18:20:00', customer: 'Lucas Bernard', total: 52.30, status: 'delivered' },
];

const salesData = [
  { day: 'Lun', sales: 1200 },
  { day: 'Mar', sales: 1500 },
  { day: 'Mer', sales: 1100 },
  { day: 'Jeu', sales: 1800 },
  { day: 'Ven', sales: 2200 },
  { day: 'Sam', sales: 2800 },
  { day: 'Dim', sales: 1900 },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState(mockOrders);
  const maxSales = Math.max(...salesData.map((d) => d.sales));

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue sur votre espace commerçant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Commandes du jour"
          value={12}
          icon={ShoppingCart}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Revenus du jour"
          value="458,50 €"
          icon={Euro}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Produits actifs"
          value={24}
          icon={Package}
        />
        <StatsCard
          title="Taux de conversion"
          value="78%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {salesData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary-500 rounded-t-md transition-all hover:bg-primary-600"
                    style={{ height: `${(data.sales / maxSales) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières commandes</CardTitle>
          </CardHeader>
          <CardContent className="-mx-4 -mb-4">
            <OrderTable
              orders={orders.slice(0, 4)}
              onStatusChange={handleStatusChange}
              showActions={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
