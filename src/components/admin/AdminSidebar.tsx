'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  Users,
  Store,
  FolderTree,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Magasins',
    href: '/admin/stores',
    icon: Store,
  },
  {
    name: 'Catégories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    name: 'Commandes',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Mon Profil',
    href: '/admin/profile',
    icon: User,
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    router.push('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <span className="text-xl font-bold text-primary-400">AmieRoute</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-800 p-2">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Paramètres</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-900/50 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
