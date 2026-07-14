'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Truck, 
  History, 
  User,
  Circle
} from 'lucide-react';
import { UserMenu } from '@/components/ui';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  { name: 'Disponibles', href: '/available', icon: Package },
  { name: 'En cours', href: '/current', icon: Truck },
  { name: 'Historique', href: '/history', icon: History },
  { name: 'Profil', href: '/profile', icon: User },
];

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAvailable, setIsAvailable] = useState(true);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isLoading, isAuthorized } = useRoleGuard({ allowedRoles: ['driver'] });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e07b39]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-inset-top">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Livreur</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isAvailable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Circle
                className={`w-2.5 h-2.5 ${isAvailable ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
              />
              {isAvailable ? 'Disponible' : 'Hors ligne'}
            </button>

            <UserMenu 
              userName={user?.name || 'Livreur'}
              userRole="Livreur"
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-30">
        <div className="flex items-center justify-around h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
