'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StatusBadge, StatCard } from '@/components/admin';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Clock,
  ShoppingCart,
  DollarSign,
  Users,
  CheckCircle,
  Pause,
  Edit,
  Trash2,
  Package,
  TrendingUp,
} from 'lucide-react';

const mockStore = {
  id: '1',
  name: 'Pizza Express',
  description: 'Les meilleures pizzas artisanales de Paris, cuites au feu de bois avec des ingrédients frais et de qualité.',
  owner: {
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 12 34 56 78',
  },
  category: 'Pizza',
  address: '45 Rue du Commerce, 75015 Paris',
  status: 'validated' as const,
  rating: 4.8,
  reviewCount: 256,
  totalOrders: 342,
  revenue: 12450,
  avgOrderValue: 36.40,
  deliveryTime: '25-35 min',
  openingHours: '11:00 - 23:00',
  createdAt: '2024-01-10',
  logo: null,
  banner: null,
};

const products = [
  { id: '1', name: 'Margherita', price: 12.50, category: 'Pizzas', orders: 89, available: true },
  { id: '2', name: 'Quattro Formaggi', price: 14.90, category: 'Pizzas', orders: 67, available: true },
  { id: '3', name: 'Pepperoni', price: 13.50, category: 'Pizzas', orders: 82, available: true },
  { id: '4', name: 'Calzone', price: 15.90, category: 'Pizzas', orders: 45, available: false },
  { id: '5', name: 'Tiramisu', price: 6.50, category: 'Desserts', orders: 34, available: true },
  { id: '6', name: 'Coca-Cola', price: 3.50, category: 'Boissons', orders: 120, available: true },
];

const recentOrders = [
  { id: '#CMD-2401', customer: 'Marie Dupont', items: 3, amount: 32.50, status: 'delivered' as const, date: '2024-03-20 14:30' },
  { id: '#CMD-2398', customer: 'Sophie Bernard', items: 2, amount: 28.90, status: 'processing' as const, date: '2024-03-20 14:15' },
  { id: '#CMD-2395', customer: 'Pierre Durand', items: 4, amount: 45.00, status: 'delivered' as const, date: '2024-03-20 13:45' },
  { id: '#CMD-2390', customer: 'Claire Moreau', items: 1, amount: 15.90, status: 'cancelled' as const, date: '2024-03-20 13:20' },
];

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Aperçu' },
    { id: 'products', label: 'Produits' },
    { id: 'orders', label: 'Commandes' },
    { id: 'stats', label: 'Statistiques' },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux magasins</span>
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <Store className="w-12 h-12 text-primary-600" />
            </div>
            <div className="flex-1 pt-4 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{mockStore.name}</h1>
                    <StatusBadge status={mockStore.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {mockStore.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{mockStore.rating}</span>
                      <span>({mockStore.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  {mockStore.status === 'validated' ? (
                    <Button variant="danger">
                      <Pause className="w-4 h-4 mr-2" />
                      Suspendre
                    </Button>
                  ) : (
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Valider
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Commandes"
                value={mockStore.totalOrders}
                icon={ShoppingCart}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
              />
              <StatCard
                title="Revenus"
                value={`€${mockStore.revenue.toLocaleString()}`}
                icon={DollarSign}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
              />
              <StatCard
                title="Panier moyen"
                value={`€${mockStore.avgOrderValue}`}
                icon={TrendingUp}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
              />
              <StatCard
                title="Produits"
                value={products.length}
                icon={Package}
                iconColor="text-orange-600"
                iconBgColor="bg-orange-100"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes récentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Articles</th>
                      <th className="pb-3">Montant</th>
                      <th className="pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="text-sm">
                        <td className="py-3 font-medium text-primary-600">{order.id}</td>
                        <td className="py-3 text-gray-900">{order.customer}</td>
                        <td className="py-3 text-gray-600">{order.items}</td>
                        <td className="py-3 font-medium text-gray-900">€{order.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{mockStore.description}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{mockStore.address}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{mockStore.openingHours}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    Inscrit le {new Date(mockStore.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétaire</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {mockStore.owner.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mockStore.owner.name}</p>
                    <p className="text-sm text-gray-500">Propriétaire</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{mockStore.owner.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{mockStore.owner.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Produits ({products.length})</h3>
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="pb-3">Produit</th>
                  <th className="pb-3">Catégorie</th>
                  <th className="pb-3">Prix</th>
                  <th className="pb-3">Commandes</th>
                  <th className="pb-3">Disponible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="text-sm">
                    <td className="py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 text-gray-900">€{product.price.toFixed(2)}</td>
                    <td className="py-3 text-gray-600">{product.orders}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available ? 'Oui' : 'Non'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Historique des commandes</h3>
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Voir la page Commandes pour l'historique complet</p>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques</h3>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Graphiques de performance à venir</p>
            <p className="text-sm mt-1">Intégrez Chart.js ou Recharts</p>
          </div>
        </div>
      )}
    </div>
  );
}
