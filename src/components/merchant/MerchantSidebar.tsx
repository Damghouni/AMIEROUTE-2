'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Store,
  LogOut
} from 'lucide-react';

const navItems = [
  {
    href: '/merchant/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/merchant/products',
    label: 'Produits',
    icon: Package,
  },
  {
    href: '/merchant/orders',
    label: 'Commandes',
    icon: ShoppingCart,
  },
  {
    href: '/merchant/stores',
    label: 'Mes Magasins',
    icon: Store,
  },
  {
    href: '/merchant/stats',
    label: 'Statistiques',
    icon: BarChart3,
  },
];

export default function MerchantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();

    toast.success('Déconnecté avec succès');

    router.push('/login');
  };

  return (
    <aside className="
      w-64
      bg-white
      border-r
      border-gray-200
      min-h-screen
      flex
      flex-col
    ">

      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600">
          AmieRoute
        </h1>

        <p className="text-sm text-gray-500">
          Espace Commerçant
        </p>
      </div>


      <nav className="mt-4 flex-1">

        {navItems.map((item)=>{

          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);


          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                px-6 py-3
                text-sm font-medium
                transition-colors

                ${
                  isActive
                    ? `
                      bg-primary-50
                      text-primary-600
                      border-r-2
                      border-primary-600
                    `
                    :
                    `
                      text-gray-600
                      hover:bg-gray-50
                      hover:text-gray-900
                    `
                }
              `}
            >

              <Icon className="h-5 w-5"/>

              {item.label}

            </Link>
          );
        })}

      </nav>


      <div className="mt-auto px-4 pb-6">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            text-sm
            font-medium
            text-red-600
            bg-red-50
            rounded-lg
            hover:bg-red-100
            transition-colors
          "
        >

          <LogOut className="h-5 w-5"/>

          Déconnexion

        </button>

      </div>

    </aside>
  );
}