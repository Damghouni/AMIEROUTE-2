'use client';

import { TrendingUp, Package, Clock, DollarSign } from 'lucide-react';

interface DriverStatsProps {
  todayDeliveries: number;
  todayEarnings: number;
  totalDeliveries: number;
  averageTime: number;
}

export default function DriverStats({
  todayDeliveries,
  todayEarnings,
  totalDeliveries,
  averageTime,
}: DriverStatsProps) {
  const stats = [
    {
      label: "Aujourd'hui",
      value: todayDeliveries,
      suffix: 'courses',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Gains du jour',
      value: todayEarnings.toFixed(2),
      suffix: '€',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total courses',
      value: totalDeliveries,
      suffix: '',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Temps moyen',
      value: averageTime,
      suffix: 'min',
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 border border-gray-100"
        >
          <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stat.value}
            {stat.suffix && <span className="text-sm font-normal text-gray-500 ml-1">{stat.suffix}</span>}
          </p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
