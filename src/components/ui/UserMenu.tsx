'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { User, LogOut, Settings } from 'lucide-react';

interface UserMenuProps {
  userName?: string;
  userRole?: string;
  size?: 'sm' | 'md';
}

export function UserMenu({ 
  userName = 'Utilisateur', 
  userRole = 'User',
  size = 'md' 
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    setIsOpen(false);
    router.push('/login');
  };

  const avatarSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const nameSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className={`${avatarSize} bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0`}>
          <User className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-primary-600`} />
        </div>
        <div className="text-left hidden sm:block">
          <p className={`${nameSize} font-medium text-gray-900`}>{userName}</p>
          <p className={`${textSize} text-gray-500`}>{userRole}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <p className="font-medium text-gray-900 text-sm">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                router.push('/admin/profile');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Mon Profil</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
