'use client';

import { useEffect, useState } from 'react';
import { MerchantSidebar } from '@/components/merchant';
import { UserMenu } from '@/components/ui';
import { Store, Bell, AlertTriangle } from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuthStore } from '@/stores/authStore';
import { storesApi } from '@/lib/api';
import Link from 'next/link';

interface StoreData {
  name: string;
}

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: isUserLoading, fetchUser } = useAuthStore();
  const { isLoading: isAuthLoading, isAuthorized } = useRoleGuard({ allowedRoles: ['merchant'] });
  const [store, setStore] = useState<StoreData | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    const fetchStore = async () => {
      if (user?.storeId) {
        try {
          setIsLoadingStore(true);
          const response = await storesApi.getById(user.storeId);
          setStore(response.data.data);
        } catch (err) {
          setError('Impossible de charger les informations du magasin.');
          console.error(err);
        } finally {
          setIsLoadingStore(false);
        }
      } else {
        setIsLoadingStore(false);
      }
    };

    if (user) {
      fetchStore();
    }
  }, [user]);

  if (isAuthLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e07b39]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-sm text-gray-600 mb-6">
            Cette section est réservée aux commerçants. Veuillez vous connecter pour continuer.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Accueil
            </Link>
            <Link href="/login?redirect=/merchant/dashboard" className="px-4 py-2 rounded-lg bg-[#e07b39] text-white hover:bg-[#c96a2d]">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-gray-500" />
            {isLoadingStore ? (
              <span className="font-semibold text-gray-900">Chargement...</span>
            ) : store ? (
              <span className="font-semibold text-gray-900">{store.name}</span>
            ) : (
              <Link href="/merchant/store" className="font-semibold text-blue-600 hover:underline">
                Créer votre magasin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <UserMenu 
              userName={user?.name || 'Commerçant'} 
              userRole="Commerçant"
            />
          </div>
        </header>
        <main className="flex-1 p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <div className="flex">
                <div className="py-1"><AlertTriangle className="h-5 w-5 text-red-500 mr-3" /></div>
                <div>
                  <p className="font-bold">Erreur</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          {isLoadingStore ? (
             <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e07b39]"></div>
             </div>
          ) : children}
        </main>
      </div>
    </div>
  );
}