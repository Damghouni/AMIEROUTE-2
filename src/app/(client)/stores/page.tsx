'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Store } from '@/types';
import { StoreCard } from '@/components/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Pizza Roma',
    description: 'Pizzas artisanales italiennes',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1yOFXyjcU3FyAl5-XWFrmU8Pb15JLqKA2HA&s',
    address: { id: '1', street: '12 Rue de Rome', city: 'Paris', postalCode: '75001', country: 'France' },
    phone: '01 23 45 67 89',
    email: 'contact@pizzaroma.fr',
    rating: 4.5,
    reviewCount: 234,
    isOpen: true,
    openingHours: [],
    categories: ['Pizza', 'Italien', 'Rapide'],
    deliveryFee: 2.5,
    minOrderAmount: 15,
    estimatedDeliveryTime: '25-35 min',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sushi Master',
    description: 'Sushis frais préparés sur place',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQimjEX0k2aYln9ZJDKmLShDHvl1rBeHI2Vyg&s',
    address: { id: '2', street: '45 Avenue de Tokyo', city: 'Paris', postalCode: '75008', country: 'France' },
    phone: '01 98 76 54 32',
    email: 'contact@sushimaster.fr',
    rating: 4.8,
    reviewCount: 456,
    isOpen: true,
    openingHours: [],
    categories: ['Sushi', 'Japonais', 'Asiatique'],
    deliveryFee: 3,
    minOrderAmount: 20,
    estimatedDeliveryTime: '30-40 min',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Burger Factory',
    description: 'Les meilleurs burgers de la ville',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwsYRVTspq-dCP912uE7HXGb_3BfVQpfKlnQ&s',
    address: { id: '3', street: '78 Boulevard Haussmann', city: 'Paris', postalCode: '75009', country: 'France' },
    phone: '01 11 22 33 44',
    email: 'contact@burgerfactory.fr',
    rating: 4.3,
    reviewCount: 189,
    isOpen: false,
    openingHours: [],
    categories: ['Burger', 'Américain', 'Fast-food'],
    deliveryFee: 0,
    minOrderAmount: 12,
    estimatedDeliveryTime: '20-30 min',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Thai Express',
    description: 'Cuisine thaïlandaise authentique',
    image: 'data:image/jpeg;base64,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',
    address: { id: '4', street: '23 Rue de Bangkok', city: 'Paris', postalCode: '75011', country: 'France' },
    phone: '01 55 66 77 88',
    email: 'contact@thaiexpress.fr',
    rating: 4.6,
    reviewCount: 312,
    isOpen: true,
    openingHours: [],
    categories: ['Thaïlandais', 'Asiatique', 'Épicé'],
    deliveryFee: 2,
    minOrderAmount: 18,
    estimatedDeliveryTime: '35-45 min',
    createdAt: new Date().toISOString(),
  },
];

const allCategories = ['Tous', 'Pizza', 'Sushi', 'Burger', 'Italien', 'Japonais', 'Asiatique', 'Américain', 'Thaïlandais', 'Épicé', 'Rapide', 'Fast-food'];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const response = await fetch(`${baseUrl}/stores`);
        
        if (response.ok) {
          const data = await response.json();
          const storesListRaw = Array.isArray(data) ? data : (data.data || []);
          const storesList = storesListRaw.map((s: any) => ({ ...s, id: s.id ?? s._id }));
          setStores(storesList);
          setError(null);
        } else {
          throw new Error('Erreur lors du chargement des magasins');
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Impossible de charger les magasins');
        setStores(mockStores); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    categories.add('Tous');
    stores.forEach(store => {
      store.categories?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories);
  }, [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.categories?.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === 'Tous' || 
        store.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Magasins & Restaurants
        </h1>
        <p className="text-gray-600">
          Découvrez les meilleurs restaurants et magasins près de chez vous
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un magasin ou une cuisine..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {selectedCategory !== 'Tous' && (
            <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              1
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Catégories</h3>
            {selectedCategory !== 'Tous' && (
              <button
                onClick={() => setSelectedCategory('Tous')}
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Effacer
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 mt-4">Chargement des magasins...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Aucun magasin trouvé pour votre recherche
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Tous');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={(store as any).id || (store as any)._id} store={store} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
