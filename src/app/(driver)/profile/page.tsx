'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  CreditCard, 
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    router.push('/login');
  };

  const driverInfo = {
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 12 34 56 78',
    vehicle: 'Scooter - Honda PCX 125',
    licensePlate: 'AB-123-CD',
    balance: 247.50,
    rating: 4.8,
    totalDeliveries: 156,
  };

  const menuItems = [
    { icon: CreditCard, label: 'Paiements', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Shield, label: 'Documents', href: '#' },
    { icon: HelpCircle, label: 'Aide', href: '#' },
  ];

  return (
    <div className="px-4 py-4">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{driverInfo.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">⭐ {driverInfo.rating}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">{driverInfo.totalDeliveries} courses</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Disponibilité</p>
            <p className="text-sm text-gray-500">
              {isAvailable ? 'Vous recevez des courses' : 'Vous êtes hors ligne'}
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              isAvailable ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isAvailable ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 mb-4 text-white">
        <p className="text-sm text-primary-100 mb-1">Solde disponible</p>
        <p className="text-3xl font-bold">{driverInfo.balance.toFixed(2)} €</p>
        <button className="mt-3 w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
          Retirer les fonds
        </button>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Informations personnelles</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{driverInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="text-sm text-gray-900">{driverInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Véhicule</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{driverInfo.vehicle}</p>
            <p className="text-xs text-gray-500">{driverInfo.licensePlate}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5 text-gray-500" />
            </div>
            <span className="flex-1 text-gray-900">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Se déconnecter
      </button>
    </div>
  );
}
