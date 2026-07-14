'use client';

import { useState } from 'react';
import { Store, Calendar, ChevronRight } from 'lucide-react';
import { DriverStats } from '@/components/driver';

interface DeliveryHistory {
  id: string;
  storeName: string;
  clientAddress: string;
  date: Date;
  amount: number;
  status: 'completed' | 'cancelled';
}

const mockHistory: DeliveryHistory[] = [
  {
    id: '1',
    storeName: 'Carrefour Market',
    clientAddress: '45 Avenue des Champs-Élysées',
    date: new Date(),
    amount: 5.50,
    status: 'completed',
  },
  {
    id: '2',
    storeName: 'Pharmacie Centrale',
    clientAddress: '23 Rue du Faubourg Saint-Honoré',
    date: new Date(),
    amount: 4.20,
    status: 'completed',
  },
  {
    id: '3',
    storeName: 'Boulangerie Paul',
    clientAddress: '78 Boulevard Saint-Germain',
    date: new Date(Date.now() - 86400000),
    amount: 3.80,
    status: 'completed',
  },
  {
    id: '4',
    storeName: 'Monoprix',
    clientAddress: '112 Rue de Rennes',
    date: new Date(Date.now() - 86400000),
    amount: 6.00,
    status: 'completed',
  },
  {
    id: '5',
    storeName: 'Franprix',
    clientAddress: '34 Rue de Courcelles',
    date: new Date(Date.now() - 172800000),
    amount: 0,
    status: 'cancelled',
  },
];

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier';
  }
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function groupByDate(deliveries: DeliveryHistory[]): Record<string, DeliveryHistory[]> {
  return deliveries.reduce((groups, delivery) => {
    const dateKey = delivery.date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(delivery);
    return groups;
  }, {} as Record<string, DeliveryHistory[]>);
}

export default function HistoryPage() {
  const [history] = useState(mockHistory);
  
  const groupedHistory = groupByDate(history);
  const todayDeliveries = history.filter(
    (d) => d.date.toDateString() === new Date().toDateString() && d.status === 'completed'
  );
  const todayEarnings = todayDeliveries.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="px-4 py-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Historique</h1>
        <p className="text-sm text-gray-500">Vos livraisons passées</p>
      </div>

      <div className="mb-6">
        <DriverStats
          todayDeliveries={todayDeliveries.length}
          todayEarnings={todayEarnings}
          totalDeliveries={history.filter((d) => d.status === 'completed').length}
          averageTime={18}
        />
      </div>

      <div className="space-y-6">
        {Object.entries(groupedHistory).map(([dateKey, deliveries]) => (
          <div key={dateKey}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-600">
                {formatDate(deliveries[0].date)}
              </h2>
            </div>
            <div className="space-y-2">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      delivery.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Store className={`w-5 h-5 ${
                        delivery.status === 'completed' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{delivery.storeName}</h3>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {delivery.clientAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {delivery.status === 'completed' ? (
                      <span className="text-green-600 font-semibold">
                        +{delivery.amount.toFixed(2)} €
                      </span>
                    ) : (
                      <span className="text-red-500 text-sm">Annulée</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
