import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, fetchUser, login, logout, register } = useAuthStore();


  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        fetchUser();
      }
    }
  }, [user, fetchUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };
}
