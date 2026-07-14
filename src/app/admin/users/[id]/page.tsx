'use client';

import { useParams, useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/admin';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  CreditCard,
} from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de la Paix, 75001 Paris',
  role: 'client' as const,
  status: 'active' as const,
  createdAt: '2024-01-15',
  lastLogin: '2024-03-20T14:30:00',
  totalOrders: 24,
  totalSpent: 856.40,
  avatar: null,
};

const orderHistory = [
  { id: '#CMD-2401', date: '2024-03-20', store: 'Pizza Express', amount: 32.50, status: 'delivered' as const },
  { id: '#CMD-2380', date: '2024-03-18', store: 'Sushi House', amount: 45.00, status: 'delivered' as const },
  { id: '#CMD-2356', date: '2024-03-15', store: 'Le Burger', amount: 28.90, status: 'delivered' as const },
  { id: '#CMD-2312', date: '2024-03-10', store: 'Thai Garden', amount: 52.30, status: 'cancelled' as const },
  { id: '#CMD-2290', date: '2024-03-05', store: 'Pasta Bella', amount: 38.20, status: 'delivered' as const },
];

const activityLog = [
  { action: 'Commande passée', detail: '#CMD-2401 - €32.50', date: '2024-03-20 14:30' },
  { action: 'Connexion', detail: 'Depuis iPhone 14', date: '2024-03-20 14:25' },
  { action: 'Adresse modifiée', detail: 'Nouvelle adresse de livraison', date: '2024-03-18 10:15' },
  { action: 'Commande passée', detail: '#CMD-2380 - €45.00', date: '2024-03-18 09:45' },
  { action: 'Connexion', detail: 'Depuis MacBook Pro', date: '2024-03-18 09:40' },
];

const roleLabels: Record<string, string> = {
  client: 'Client',
  vendor: 'Vendeur',
  delivery: 'Livreur',
  admin: 'Administrateur',
};

const roleColors: Record<string, string> = {
  client: 'bg-blue-100 text-blue-800',
  vendor: 'bg-purple-100 text-purple-800',
  delivery: 'bg-orange-100 text-orange-800',
  admin: 'bg-red-100 text-red-800',
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux utilisateurs</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {mockUser.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{mockUser.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[mockUser.role]}`}>
                  {roleLabels[mockUser.role]}
                </span>
                <StatusBadge status={mockUser.status} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{mockUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{mockUser.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{mockUser.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm">
                  Inscrit le {new Date(mockUser.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm">
                  Dernière connexion: {new Date(mockUser.lastLogin).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{mockUser.totalOrders}</p>
                <p className="text-sm text-gray-500">Commandes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">€{mockUser.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total dépensé</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <Button variant="outline" fullWidth>
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
              {mockUser.status === 'active' ? (
                <Button variant="danger" fullWidth>
                  <Ban className="w-4 h-4 mr-2" />
                  Suspendre le compte
                </Button>
              ) : (
                <Button fullWidth>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activer le compte
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des commandes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Magasin</th>
                    <th className="pb-3">Montant</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderHistory.map((order) => (
                    <tr key={order.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 font-medium text-primary-600">{order.id}</td>
                      <td className="py-3 text-gray-600">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 text-gray-900">{order.store}</td>
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

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          {mockUser.role === 'client' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moyens de paiement</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expire 12/25</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
