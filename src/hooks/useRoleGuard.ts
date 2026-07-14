'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/authStore';

type Role = 'client' | 'merchant' | 'driver' | 'admin';

interface RoleGuardOptions {
  allowedRoles: Role[];
  redirectTo?: string;
}

export function useRoleGuard({ allowedRoles, redirectTo }: RoleGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      let token = Cookies.get('auth_token');
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token') || undefined;
      }

      if (!token) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      if (!isAuthenticated) {
        try {
          await fetchUser();
        } catch (error: any) {
          const status = (error as any)?.response?.status;
          if (status === 401) {
            router.push(`/login?redirect=${pathname}`);
            return;
          }
          // Ne pas rediriger sur non-401, juste arrêter le checking
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [fetchUser, isAuthenticated, router, pathname]);

  useEffect(() => {
    if (!isChecking && user && !allowedRoles.includes(user.role)) {
      const defaultRedirect = redirectTo || getDefaultRoute(user.role);
      router.push(defaultRedirect);
    }
  }, [isChecking, user, allowedRoles, redirectTo, router]);

  const isAuthorized = !isLoading && !isChecking && isAuthenticated && user && allowedRoles.includes(user.role);

  return {
    isLoading: isLoading || isChecking,
    isAuthorized,
    user,
  };
}

function getDefaultRoute(role: Role): string {
  switch (role) {
    case 'client':
      return '/stores';
    case 'merchant':
      return '/merchant/dashboard';
    case 'driver':
      return '/available';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

export function useClientGuard() {
  return useRoleGuard({ allowedRoles: ['client'] });
}

export function useMerchantGuard() {
  return useRoleGuard({ allowedRoles: ['merchant'] });
}

export function useDriverGuard() {
  return useRoleGuard({ allowedRoles: ['driver'] });
}

export function useAdminGuard() {
  return useRoleGuard({ allowedRoles: ['admin'] });
}