'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, StatusBadge } from '@/components/admin';
import Button from '@/components/ui/Button';
import { Search, Store, Eye, CheckCircle, XCircle, Pause, Star, MapPin } from 'lucide-react';

interface StoreData {
  id: string;
  name: string;
  owner: string;
  category: string;
  address: string;
  status: 'pending' | 'validated' | 'suspended';
  rating: number;
  totalOrders: number;
  revenue: number;
  createdAt: string;
}

const mockStores: StoreData[] = [
  { id: '1', name: 'Pizza Express', owner: 'Jean Martin', category: 'Pizza', address: '45 Rue du Commerce, Paris', status: 'validated', rating: 4.8, totalOrders: 342, revenue: 12450, createdAt: '2024-01-10' },
  { id: '2', name: 'Sushi House', owner: 'Yuki Tanaka', category: 'Japonais', address: '12 Avenue des Champs, Paris', status: 'validated', rating: 4.6, totalOrders: 287, revenue: 10820, createdAt: '2024-01-12' },
  { id: '3', name: 'Le Burger', owner: 'Pierre Durand', category: 'Burgers', address: '78 Boulevard Haussmann, Paris', status: 'validated', rating: 4.5, totalOrders: 256, revenue: 8960, createdAt: '2024-01-15' },
  { id: '4', name: 'Fresh & Co', owner: 'Marie Laurent', category: 'Salades', address: '23 Rue de Rivoli, Paris', status: 'pending', rating: 0, totalOrders: 0, revenue: 0, createdAt: '2024-03-18' },
  { id: '5', name: 'Thai Garden', owner: 'Somchai Patel', category: 'Thaïlandais', address: '56 Rue de la Paix, Paris', status: 'suspended', rating: 3.2, totalOrders: 198, revenue: 7540, createdAt: '2024-01-08' },
  { id: '6', name: 'Pasta Bella', owner: 'Marco Rossi', category: 'Italien', address: '34 Avenue Mozart, Paris', status: 'validated', rating: 4.7, totalOrders: 176, revenue: 6230, createdAt: '2024-01-20' },
  { id: '7', name: 'Kebab King', owner: 'Ahmed Hassan', category: 'Kebab', address: '89 Rue du Faubourg, Paris', status: 'pending', rating: 0, totalOrders: 0, revenue: 0, createdAt: '2024-03-19' },
  { id: '8', name: 'Wok & Roll', owner: 'Li Wei', category: 'Chinois', address: '67 Avenue de la République, Paris', status: 'validated', rating: 4.4, totalOrders: 145, revenue: 5120, createdAt: '2024-02-01' },
];

export default function StoresPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(mockStores.map((s) => s.category)));

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingCount = mockStores.filter((s) => s.status === 'pending').length;

  const handleValidate = (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Validate store', storeId);
  };

  const handleSuspend = (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Suspend store', storeId);
  };

  const handleReactivate = (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Reactivate store', storeId);
  };

  const columns = [
    {
      key: 'name',
      header: 'Magasin',
      sortable: true,
      render: (store: StoreData) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{store.name}</p>
            <p className="text-sm text-gray-500">{store.owner}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      sortable: true,
      render: (store: StoreData) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {store.category}
        </span>
      ),
    },
    {
      key: 'address',
      header: 'Adresse',
      render: (store: StoreData) => (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px]">{store.address}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (store: StoreData) => <StatusBadge status={store.status} />,
    },
    {
      key: 'rating',
      header: 'Note',
      sortable: true,
      render: (store: StoreData) => (
        store.rating > 0 ? (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{store.rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )
      ),
    },
    {
      key: 'totalOrders',
      header: 'Commandes',
      sortable: true,
      render: (store: StoreData) => (
        <span className="font-medium">{store.totalOrders}</span>
      ),
    },
    {
      key: 'revenue',
      header: 'Revenus',
      sortable: true,
      render: (store: StoreData) => (
        <span className="font-medium text-green-600">€{store.revenue.toLocaleString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (store: StoreData) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/stores/${store.id}`);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Voir les détails"
          >
            <Eye className="w-4 h-4" />
          </button>
          {store.status === 'pending' && (
            <>
              <button
                onClick={(e) => handleValidate(store.id, e)}
                className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                title="Valider"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleSuspend(store.id, e)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Rejeter"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {store.status === 'validated' && (
            <button
              onClick={(e) => handleSuspend(store.id, e)}
              className="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors"
              title="Suspendre"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          {store.status === 'suspended' && (
            <button
              onClick={(e) => handleReactivate(store.id, e)}
              className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
              title="Réactiver"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Magasins</h1>
          <p className="text-gray-500 mt-1">
            {mockStores.length} magasins
            {pendingCount > 0 && (
              <span className="ml-2 text-orange-600">• {pendingCount} en attente de validation</span>
            )}
          </p>
        </div>
        <Button>
          <Store className="w-4 h-4 mr-2" />
          Ajouter un magasin
        </Button>
      </div>

      {pendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-900">{pendingCount} magasin(s) en attente de validation</p>
              <p className="text-sm text-orange-700">Des magasins attendent votre approbation pour commencer à vendre</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setStatusFilter('pending')}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Voir les demandes
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou propriétaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validé</option>
              <option value="suspended">Suspendu</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredStores}
        columns={columns}
        pageSize={10}
        onRowClick={(store) => router.push(`/admin/stores/${store.id}`)}
        emptyMessage="Aucun magasin trouvé"
      />
    </div>
  );
}
