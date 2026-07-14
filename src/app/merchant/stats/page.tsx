'use client';

import { useState } from 'react';
import { Euro, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { StatsCard } from '@/components/merchant';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const periodOptions = [
  { label: '7 jours', value: '7d' },
  { label: '30 jours', value: '30d' },
  { label: '3 mois', value: '3m' },
  { label: '1 an', value: '1y' },
];

const revenueData = {
  '7d': [
    { label: 'Lun', value: 1200 },
    { label: 'Mar', value: 1500 },
    { label: 'Mer', value: 1100 },
    { label: 'Jeu', value: 1800 },
    { label: 'Ven', value: 2200 },
    { label: 'Sam', value: 2800 },
    { label: 'Dim', value: 1900 },
  ],
  '30d': [
    { label: 'S1', value: 8500 },
    { label: 'S2', value: 9200 },
    { label: 'S3', value: 10500 },
    { label: 'S4', value: 11800 },
  ],
  '3m': [
    { label: 'Jan', value: 35000 },
    { label: 'Fév', value: 38000 },
    { label: 'Mar', value: 42000 },
  ],
  '1y': [
    { label: 'T1', value: 95000 },
    { label: 'T2', value: 110000 },
    { label: 'T3', value: 125000 },
    { label: 'T4', value: 140000 },
  ],
};

const topProducts = [
  { name: 'Pizza Margherita', sold: 245, revenue: 3062.50 },
  { name: 'Burger Classic', sold: 189, revenue: 2646.00 },
  { name: 'Salade César', sold: 156, revenue: 1544.40 },
  { name: 'Tiramisu', sold: 134, revenue: 871.00 },
  { name: 'Coca-Cola', sold: 312, revenue: 780.00 },
];

const orderStats = {
  total: 892,
  avgPerDay: 29.7,
  avgValue: 32.50,
  deliveredRate: 94.2,
};

export default function StatsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('7d');
  const data = revenueData[period];
  const maxValue = Math.max(...data.map((d) => d.value));
  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">Analysez les performances de votre établissement</p>
        </div>
        <div className="flex gap-2">
          {periodOptions.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={period === opt.value ? 'primary' : 'outline'}
              onClick={() => setPeriod(opt.value as typeof period)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenus totaux"
          value={`${totalRevenue.toLocaleString('fr-FR')} €`}
          icon={Euro}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Commandes totales"
          value={orderStats.total}
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Panier moyen"
          value={`${orderStats.avgValue.toFixed(2)} €`}
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Taux de livraison"
          value={`${orderStats.deliveredRate}%`}
          icon={Package}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-64 gap-3">
              {data.map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">
                    {item.value.toLocaleString('fr-FR')} €
                  </span>
                  <div
                    className="w-full bg-primary-500 rounded-t-md transition-all hover:bg-primary-600"
                    style={{ height: `${(item.value / maxValue) * 180}px` }}
                  />
                  <span className="text-sm text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} vendus</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.revenue.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-500 mt-1">Commandes totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{orderStats.avgPerDay.toFixed(1)}</p>
              <p className="text-sm text-gray-500 mt-1">Commandes / jour</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{orderStats.avgValue.toFixed(2)} €</p>
              <p className="text-sm text-gray-500 mt-1">Valeur moyenne</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{orderStats.deliveredRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Taux de livraison</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
