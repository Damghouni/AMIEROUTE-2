'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Home, 
  Store, 
  ClipboardList,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartSidebar } from '@/components/client';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Magasins', href: '/stores', icon: Store },
  { name: 'Commandes', href: '/orders', icon: ClipboardList },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { logout } = useAuthStore();
  const { isLoading, isAuthorized } = useRoleGuard({ allowedRoles: ['client'] });

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    router.push('/login');
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">
                  AmieRoute
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Rechercher un magasin ou un produit..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              <Link
                href="/profile"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-100 transition-colors text-gray-600 hover:text-red-600"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
