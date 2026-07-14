'use client';

import { useState } from 'react';
import { DataTable, StatusBadge } from '@/components/admin';
import Button from '@/components/ui/Button';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  ShoppingCart,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
} from 'lucide-react';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  store: {
    name: string;
  };
  delivery?: {
    name: string;
  };
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  address: string;
}

const mockOrders: Order[] = [
  { id: 'CMD-2401', customer: { name: 'Marie Dupont', email: 'marie@email.com' }, store: { name: 'Pizza Express' }, delivery: { name: 'Thomas Petit' }, items: 3, total: 32.50, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-03-20T14:30:00', address: '123 Rue de la Paix, Paris' },
  { id: 'CMD-2400', customer: { name: 'Jean Martin', email: 'jean@email.com' }, store: { name: 'Sushi House' }, delivery: { name: 'Emma Leroy' }, items: 2, total: 45.00, status: 'processing', paymentStatus: 'paid', createdAt: '2024-03-20T14:15:00', address: '45 Avenue Mozart, Paris' },
  { id: 'CMD-2399', customer: { name: 'Sophie Bernard', email: 'sophie@email.com' }, store: { name: 'Le Burger' }, items: 4, total: 28.90, status: 'pending', paymentStatus: 'pending', createdAt: '2024-03-20T14:00:00', address: '78 Boulevard Haussmann, Paris' },
  { id: 'CMD-2398', customer: { name: 'Pierre Durand', email: 'pierre@email.com' }, store: { name: 'Thai Garden' }, delivery: { name: 'Lucas Roux' }, items: 2, total: 52.30, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-03-20T13:45:00', address: '12 Rue du Commerce, Paris' },
  { id: 'CMD-2397', customer: { name: 'Claire Moreau', email: 'claire@email.com' }, store: { name: 'Pizza Express' }, items: 1, total: 19.90, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2024-03-20T13:30:00', address: '56 Avenue de la République, Paris' },
  { id: 'CMD-2396', customer: { name: 'Lucas Bernard', email: 'lucas@email.com' }, store: { name: 'Pasta Bella' }, delivery: { name: 'Thomas Petit' }, items: 3, total: 38.20, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-03-20T13:15:00', address: '89 Rue de Rivoli, Paris' },
  { id: 'CMD-2395', customer: { name: 'Emma Laurent', email: 'emma@email.com' }, store: { name: 'Fresh & Co' }, items: 2, total: 24.50, status: 'processing', paymentStatus: 'paid', createdAt: '2024-03-20T13:00:00', address: '34 Boulevard Saint-Germain, Paris' },
  { id: 'CMD-2394', customer: { name: 'Hugo Petit', email: 'hugo@email.com' }, store: { name: 'Wok & Roll' }, delivery: { name: 'Emma Leroy' }, items: 5, total: 67.80, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-03-20T12:45:00', address: '67 Rue de la Victoire, Paris' },
];

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  refunded: { label: 'Remboursé', color: 'bg-blue-100 text-blue-800' },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === 'pending').length,
    processing: mockOrders.filter((o) => o.status === 'processing').length,
    delivered: mockOrders.filter((o) => o.status === 'delivered').length,
    cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
  };

  const columns = [
    {
      key: 'id',
      header: 'Commande',
      sortable: true,
      render: (order: Order) => (
        <div>
          <p className="font-medium text-primary-600">#{order.id}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleString('fr-FR')}
          </p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Client',
      sortable: true,
      render: (order: Order) => (
        <div>
          <p className="font-medium text-gray-900">{order.customer.name}</p>
          <p className="text-sm text-gray-500">{order.customer.email}</p>
        </div>
      ),
    },
    {
      key: 'store',
      header: 'Magasin',
      sortable: true,
      render: (order: Order) => (
        <span className="text-gray-900">{order.store.name}</span>
      ),
    },
    {
      key: 'delivery',
      header: 'Livreur',
      render: (order: Order) => (
        order.delivery ? (
          <span className="text-gray-900">{order.delivery.name}</span>
        ) : (
          <span className="text-gray-400 text-sm">Non assigné</span>
        )
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (order: Order) => (
        <div>
          <p className="font-medium text-gray-900">€{order.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{order.items} article(s)</p>
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Paiement',
      render: (order: Order) => {
        const status = paymentStatusLabels[order.paymentStatus];
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Voir les détails"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 mt-1">Supervision de toutes les commandes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border transition-colors ${
            statusFilter === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl border transition-colors ${
            statusFilter === 'pending'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter('processing')}
          className={`p-4 rounded-xl border transition-colors ${
            statusFilter === 'processing'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-orange-600" />
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              <p className="text-sm text-gray-500">En cours</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter('delivered')}
          className={`p-4 rounded-xl border transition-colors ${
            statusFilter === 'delivered'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-sm text-gray-500">Livrées</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-xl border transition-colors ${
            statusFilter === 'cancelled'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-sm text-gray-500">Annulées</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, client ou magasin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="all">Toutes</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        pageSize={10}
        onRowClick={(order) => setSelectedOrder(order)}
        emptyMessage="Aucune commande trouvée"
      />

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Commande #{selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Magasin</h3>
                  <p className="font-medium text-gray-900">{selectedOrder.store.name}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Adresse de livraison</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-900">{selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Livreur</h3>
                {selectedOrder.delivery ? (
                  <p className="font-medium text-gray-900">{selectedOrder.delivery.name}</p>
                ) : (
                  <p className="text-gray-500">Non assigné</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{selectedOrder.items} article(s)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      paymentStatusLabels[selectedOrder.paymentStatus].color
                    }`}
                  >
                    {paymentStatusLabels[selectedOrder.paymentStatus].label}
                  </span>
                </div>
              </div>

              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button fullWidth>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button variant="danger" fullWidth>
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <>
                      <Button fullWidth>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marquer comme livré
                      </Button>
                      <Button variant="outline" fullWidth>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Signaler un problème
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
