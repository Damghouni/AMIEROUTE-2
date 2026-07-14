'use client';

import { useState } from 'react';
import { MapPin, Clock, Shield, Truck, Menu, X, ChevronDown, Users, Building2, Package, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#2d3748] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#e07b39]">A</span>
                <span className="text-white">MIEROUTE</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavItem label="VOS BESOINS MÉTIER" hasDropdown />
              <NavItem label="VOS CAS D'USAGE" hasDropdown />
              <NavItem label="NOS SOLUTIONS" hasDropdown />
              <NavItem label="NOS RESSOURCES" hasDropdown />
              <NavItem label="ENTREPRISE" />
              <Link href="/login" className="text-white hover:text-[#e07b39] transition-colors text-sm font-medium">
                CONTACTEZ-NOUS
              </Link>
              <div className="flex items-center gap-1 bg-[#3d4a5c] px-3 py-1.5 rounded text-white text-sm cursor-pointer hover:bg-[#4a5568]">
                FR <ChevronDown className="h-4 w-4" />
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2d3748] border-t border-[#3d4a5c]">
            <div className="px-4 py-4 space-y-4">
              <MobileNavItem label="VOS BESOINS MÉTIER" />
              <MobileNavItem label="VOS CAS D'USAGE" />
              <MobileNavItem label="NOS SOLUTIONS" />
              <MobileNavItem label="NOS RESSOURCES" />
              <MobileNavItem label="ENTREPRISE" />
              <Link href="/login" className="block text-white py-2">CONTACTEZ-NOUS</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image - Orange delivery trucks */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          {/* Overlay matching the Klareo style - warm sunset orange tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d3748]/85 via-[#2d3748]/50 to-[#d97b3d]/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a202c]/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Boostez
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white mb-2">
            votre activité de livraison du dernier kilomètre grâce au
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10">
            <span className="text-[#e07b39] font-semibold">Delivery Management System</span>
            <span className="text-white"> de AMIEROUTE</span>
          </p>

          {/* Search Engine / Delivery Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un restaurant, magasin ou produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border-l border-gray-200">
                <MapPin className="h-5 w-5 text-[#e07b39]" />
                <input
                  type="text"
                  placeholder="Votre adresse"
                  className="w-40 text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <Link
                href="/stores"
                className="bg-[#e07b39] hover:bg-[#c96a2d] text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Rechercher
              </Link>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-block bg-[#e07b39] hover:bg-[#c96a2d] text-white px-10 py-4 rounded text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Réservez une démo
          </Link>

          {/* Quick categories */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <QuickCategory icon="🍔" label="Restaurants" />
            <QuickCategory icon="🛒" label="Supermarchés" />
            <QuickCategory icon="💊" label="Pharmacies" />
            <QuickCategory icon="🌸" label="Fleuristes" />
            <QuickCategory icon="📦" label="Colis" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#2d3748] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="500+" label="Partenaires" icon={<Building2 className="h-8 w-8" />} />
            <StatCard number="10K+" label="Livraisons/jour" icon={<Package className="h-8 w-8" />} />
            <StatCard number="1000+" label="Livreurs actifs" icon={<Users className="h-8 w-8" />} />
            <StatCard number="30min" label="Temps moyen" icon={<Clock className="h-8 w-8" />} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] mb-4">
              Une solution complète pour tous les acteurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme connecte clients, commerçants et livreurs pour une expérience de livraison optimale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="Clients"
              description="Commandez facilement depuis vos restaurants et magasins préférés. Suivez vos livraisons en temps réel."
              icon={<Users className="h-12 w-12" />}
              color="orange"
              link="/stores"
            />
            <ServiceCard
              title="Commerçants"
              description="Gérez vos produits, suivez vos commandes et développez votre activité grâce à notre plateforme."
              icon={<Building2 className="h-12 w-12" />}
              color="gray"
              link="/register"
            />
            <ServiceCard
              title="Livreurs"
              description="Devenez livreur partenaire et bénéficiez d'une flexibilité totale dans votre travail."
              icon={<Truck className="h-12 w-12" />}
              color="orange"
              link="/register"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] mb-4">
              Pourquoi choisir AmieRoute ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-[#e07b39]" />}
              title="Livraison express"
              description="Livraison en moins de 30 minutes grâce à notre algorithme d'optimisation des tournées."
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-[#e07b39]" />}
              title="Suivi temps réel"
              description="Géolocalisation en direct de votre commande et notifications à chaque étape."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-[#e07b39]" />}
              title="100% sécurisé"
              description="Paiements sécurisés et protection des données selon les normes les plus strictes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#e07b39]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre logistique ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des centaines d'entreprises qui font confiance à AmieRoute
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-[#e07b39] px-8 py-4 rounded text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d3748] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold mb-4 tracking-tight">
                <span className="text-[#e07b39]">A</span>MIEROUTE
              </div>
              <p className="text-gray-400">
                La solution de livraison du dernier kilomètre pour les entreprises modernes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/stores" className="hover:text-[#e07b39] transition-colors">Pour les clients</Link></li>
                <li><Link href="/register" className="hover:text-[#e07b39] transition-colors">Pour les commerçants</Link></li>
                <li><Link href="/register" className="hover:text-[#e07b39] transition-colors">Pour les livreurs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">À propos</Link></li>
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">Carrières</Link></li>
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">Mentions légales</Link></li>
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">CGU</Link></li>
                <li><Link href="#" className="hover:text-[#e07b39] transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} AmieRoute. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ label, hasDropdown }: { label: string; hasDropdown?: boolean }) {
  return (
    <button className="flex items-center gap-1 text-white hover:text-[#e07b39] transition-colors text-sm font-medium">
      {label}
      {hasDropdown && <ChevronDown className="h-4 w-4" />}
    </button>
  );
}

function MobileNavItem({ label }: { label: string }) {
  return (
    <button className="block text-white py-2 w-full text-left hover:text-[#e07b39] transition-colors">
      {label}
    </button>
  );
}

function QuickCategory({ icon, label }: { icon: string; label: string }) {
  return (
    <Link
      href="/stores"
      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all"
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-white">
      <div className="text-[#e07b39] flex justify-center mb-2">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold mb-1">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

function ServiceCard({ 
  title, 
  description, 
  icon, 
  color, 
  link 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color: 'orange' | 'gray';
  link: string;
}) {
  const colors = {
    orange: 'bg-[#e07b39] hover:bg-[#c96a2d]',
    gray: 'bg-[#2d3748] hover:bg-[#3d4a5c]',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colors[color]} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#2d3748] mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        href={link}
        className={`inline-block ${colors[color]} text-white px-6 py-3 rounded-lg font-medium transition-colors`}
      >
        En savoir plus
      </Link>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e07b39]/10 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2d3748] mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
