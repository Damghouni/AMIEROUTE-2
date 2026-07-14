'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, StatusBadge } from '@/components/admin';
import Button from '@/components/ui/Button';
import { Search, Filter, UserPlus, Eye, Ban, CheckCircle, MoreVertical } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'vendor' | 'delivery' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  orders: number;
}

const mockUsers: User[] = [
  { id: '1', name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'client', status: 'active', createdAt: '2024-01-15', orders: 24 },
  { id: '2', name: 'Jean Martin', email: 'jean.martin@email.com', role: 'vendor', status: 'active', createdAt: '2024-01-10', orders: 0 },
  { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'delivery', status: 'active', createdAt: '2024-01-08', orders: 0 },
  { id: '4', name: 'Pierre Durand', email: 'pierre.durand@email.com', role: 'client', status: 'suspended', createdAt: '2024-01-05', orders: 12 },
  { id: '5', name: 'Claire Moreau', email: 'claire.moreau@email.com', role: 'client', status: 'inactive', createdAt: '2024-01-03', orders: 3 },
  { id: '6', name: 'Thomas Petit', email: 'thomas.petit@email.com', role: 'vendor', status: 'active', createdAt: '2024-01-02', orders: 0 },
  { id: '7', name: 'Emma Leroy', email: 'emma.leroy@email.com', role: 'client', status: 'active', createdAt: '2024-01-01', orders: 45 },
  { id: '8', name: 'Lucas Roux', email: 'lucas.roux@email.com', role: 'delivery', status: 'suspended', createdAt: '2023-12-28', orders: 0 },
];

const roleLabels: Record<string, string> = {
  client: 'Client',
  vendor: 'Vendeur',
  delivery: 'Livreur',
  admin: 'Admin',
};

const roleColors: Record<string, string> = {
  client: 'bg-blue-100 text-blue-800',
  vendor: 'bg-purple-100 text-purple-800',
  delivery: 'bg-orange-100 text-orange-800',
  admin: 'bg-red-100 text-red-800',
};

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      header: 'Utilisateur',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      sortable: true,
      render: (user: User) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
          {roleLabels[user.role]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: 'createdAt',
      header: 'Inscrit le',
      sortable: true,
      render: (user: User) => (
        <span className="text-gray-600">
          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'orders',
      header: 'Commandes',
      sortable: true,
      render: (user: User) => (
        <span className="font-medium">{user.orders}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/users/${user.id}`);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Voir le profil"
          >
            <Eye className="w-4 h-4" />
          </button>
          {user.status === 'active' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Suspend user', user.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              title="Suspendre"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Activate user', user.id);
              }}
              className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
              title="Activer"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(selectedUser === user.id ? null : user.id);
            }}
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
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">{mockUsers.length} utilisateurs inscrits</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">Tous les rôles</option>
              <option value="client">Client</option>
              <option value="vendor">Vendeur</option>
              <option value="delivery">Livreur</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        pageSize={10}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        emptyMessage="Aucun utilisateur trouvé"
      />
    </div>
  );
}
