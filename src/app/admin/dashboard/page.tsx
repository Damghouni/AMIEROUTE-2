'use client';

import { useState } from 'react';
import { StatCard, StatusBadge } from '@/components/admin';
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from 'lucide-react';

const stats = [
  {
    title: 'Utilisateurs',
    value: '12,847',
    change: 12.5,
    icon: Users,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100',
  },
  {
    title: 'Magasins',
    value: '384',
    change: 8.2,
    icon: Store,
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-100',
  },
  {
    title: 'Commandes',
    value: '5,429',
    change: 23.1,
    icon: ShoppingCart,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-100',
  },
  {
    title: 'Revenus',
    value: '€128,540',
    change: 18.7,
    icon: DollarSign,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-100',
  },
];

const recentOrders = [
  { id: '#CMD-2401', customer: 'Marie Dupont', store: 'Pizza Express', amount: '€32.50', status: 'delivered' as const, time: 'Il y a 5 min' },
  { id: '#CMD-2400', customer: 'Jean Martin', store: 'Sushi House', amount: '€45.00', status: 'processing' as const, time: 'Il y a 12 min' },
  { id: '#CMD-2399', customer: 'Sophie Bernard', store: 'Le Burger', amount: '€28.90', status: 'pending' as const, time: 'Il y a 18 min' },
  { id: '#CMD-2398', customer: 'Pierre Durand', store: 'Thai Garden', amount: '€52.30', status: 'delivered' as const, time: 'Il y a 25 min' },
  { id: '#CMD-2397', customer: 'Claire Moreau', store: 'Pizza Express', amount: '€19.90', status: 'cancelled' as const, time: 'Il y a 32 min' },
];

const topStores = [
  { name: 'Pizza Express', orders: 342, revenue: '€12,450', growth: 15.2 },
  { name: 'Sushi House', orders: 287, revenue: '€10,820', growth: 8.7 },
  { name: 'Le Burger', orders: 256, revenue: '€8,960', growth: 12.3 },
  { name: 'Thai Garden', orders: 198, revenue: '€7,540', growth: -2.1 },
  { name: 'Pasta Bella', orders: 176, revenue: '€6,230', growth: 5.8 },
];

const recentActivities = [
  { action: 'Nouveau magasin inscrit', detail: 'Fresh & Co', time: 'Il y a 2 min', type: 'store' },
  { action: 'Utilisateur vérifié', detail: 'jean.martin@email.com', time: 'Il y a 5 min', type: 'user' },
  { action: 'Commande livrée', detail: '#CMD-2401', time: 'Il y a 8 min', type: 'order' },
  { action: 'Magasin suspendu', detail: 'Fast Food XYZ', time: 'Il y a 15 min', type: 'warning' },
  { action: 'Nouvelle catégorie créée', detail: 'Desserts', time: 'Il y a 22 min', type: 'category' },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance des ventes</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-gray-600">Commandes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Revenus</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Graphique de performance</p>
              <p className="text-sm text-gray-400">Intégrez une librairie de graphiques (Chart.js, Recharts)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'warning' ? 'bg-red-500' :
                  activity.type === 'store' ? 'bg-purple-500' :
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'order' ? 'bg-green-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            <a href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir tout
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Montant</th>
                  <th className="pb-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 text-gray-600">{order.customer}</td>
                    <td className="py-3 text-gray-900">{order.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Magasins</h2>
            <a href="/admin/stores" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir tout
            </a>
          </div>
          <div className="space-y-4">
            {topStores.map((store, index) => (
              <div key={store.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{store.name}</p>
                  <p className="text-sm text-gray-500">{store.orders} commandes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{store.revenue}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm ${
                    store.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {store.growth >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{Math.abs(store.growth)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
