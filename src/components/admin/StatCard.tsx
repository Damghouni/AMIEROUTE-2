'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs mois dernier',
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBgColor = 'bg-primary-100',
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? 'text-green-600'
                    : isNegative
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {isPositive && '+'}
                {change}%
              </span>
              <span className="text-sm text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
