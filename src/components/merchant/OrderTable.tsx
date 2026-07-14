'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

interface OrderTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
  showActions?: boolean;
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderTable({ orders, onStatusChange, showActions = true }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commande
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/merchant/orders/${order.id}`} className="text-primary-600 hover:underline font-medium">
                  #{order.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.total.toFixed(2)} €
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusChange?.(order.id, 'preparing')}
                      >
                        Préparer
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onStatusChange?.(order.id, 'ready')}
                      >
                        Prêt
                      </Button>
                    )}
                    <Link href={`/merchant/orders/${order.id}`}>
                      <Button size="sm" variant="ghost">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune commande trouvée
        </div>
      )}
    </div>
  );
}
