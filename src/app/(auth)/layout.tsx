'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-orange-900/70" />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold">
            <span className="text-orange-500">A</span>
            <span className="text-white">MIEROUTE</span>
          </Link>
          
          {/* Main illustration area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Livraison"
                  className="w-80 h-60 object-cover rounded-2xl shadow-2xl mx-auto"
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Delivery Management System
              </h2>
              <p className="text-xl text-gray-300 max-w-md">
                Optimisez vos livraisons du dernier kilomètre avec notre plateforme intelligente
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <FeatureItem icon="🚀" label="Livraison rapide" />
            <FeatureItem icon="📍" label="Suivi temps réel" />
            <FeatureItem icon="🔒" label="100% sécurisé" />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-orange-500">A</span>
              <span className="text-gray-900">MIEROUTE</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-white font-medium">{label}</div>
    </div>
  );
}
