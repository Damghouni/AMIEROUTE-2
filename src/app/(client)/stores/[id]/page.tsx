'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Clock, MapPin, Phone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Store, Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { ProductCard, CartSidebar } from '@/components/client';
import Button from '@/components/ui/Button';

const mockStore: Store = {
  id: '1',
  name: 'Pizza Roma',
  description: 'Pizzas artisanales italiennes cuites au feu de bois. Nous utilisons uniquement des ingrédients frais et de qualité pour vous offrir le meilleur de la cuisine italienne.',
  image: '/images/pizza-store-cover.jpg',
  address: { id: '1', street: '12 Rue de Rome', city: 'Paris', postalCode: '75001', country: 'France' },
  phone: '01 23 45 67 89',
  email: 'contact@pizzaroma.fr',
  rating: 4.5,
  reviewCount: 234,
  isOpen: true,
  openingHours: [
    { day: 1, open: '11:00', close: '22:00' },
    { day: 2, open: '11:00', close: '22:00' },
    { day: 3, open: '11:00', close: '22:00' },
    { day: 4, open: '11:00', close: '22:00' },
    { day: 5, open: '11:00', close: '23:00' },
    { day: 6, open: '11:00', close: '23:00' },
    { day: 0, open: '12:00', close: '21:00' },
  ],
  categories: ['Pizza', 'Italien', 'Rapide'],
  deliveryFee: 2.5,
  minOrderAmount: 15,
  estimatedDeliveryTime: '25-35 min',
  createdAt: new Date().toISOString(),
};

const mockProducts: Product[] = [
  {
    id: 'p1',
    storeId: '1',
    name: 'Pizza Margherita',
    description: 'Sauce tomate, mozzarella, basilic frais',
    price: 12.5,
    image: '/images/margherita.jpg',
    category: 'Pizzas Classiques',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    storeId: '1',
    name: 'Pizza 4 Fromages',
    description: 'Mozzarella, gorgonzola, parmesan, chèvre',
    price: 14.5,
    image: '/images/4fromages.jpg',
    category: 'Pizzas Classiques',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    storeId: '1',
    name: 'Pizza Pepperoni',
    description: 'Sauce tomate, mozzarella, pepperoni épicé',
    price: 13.5,
    image: '/images/pepperoni.jpg',
    category: 'Pizzas Classiques',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    storeId: '1',
    name: 'Pizza Végétarienne',
    description: 'Légumes grillés, olives, champignons, poivrons',
    price: 13,
    image: '/images/vegetarienne.jpg',
    category: 'Pizzas Spéciales',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    storeId: '1',
    name: 'Pizza Calzone',
    description: 'Pizza pliée garnie de jambon, champignons, mozzarella',
    price: 15,
    image: '/images/calzone.jpg',
    category: 'Pizzas Spéciales',
    isAvailable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    storeId: '1',
    name: 'Tiramisu',
    description: 'Dessert italien traditionnel au mascarpone et café',
    price: 6.5,
    image: '/images/tiramisu.jpg',
    category: 'Desserts',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p7',
    storeId: '1',
    name: 'Coca-Cola 33cl',
    description: '',
    price: 2.5,
    image: '/images/coca.jpg',
    category: 'Boissons',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p8',
    storeId: '1',
    name: 'Eau minérale 50cl',
    description: '',
    price: 2,
    image: '/images/water.jpg',
    category: 'Boissons',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
];

export default function StorePage() {
  const params = useParams();
  const storeId = (params as any).id as string;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setStore: setCartStore, getItemCount, getTotal } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        
        // Fetch store details
        const storeResponse = await fetch(`${baseUrl}/stores/${storeId}`);
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          const storeInfoRaw = storeData.data || storeData;
          const storeInfo = {
            ...storeInfoRaw,
            id: storeInfoRaw.id ?? storeInfoRaw._id,
            deliveryFee: Number((storeInfoRaw as any).deliveryFee ?? 0),
            minOrderAmount: Number((storeInfoRaw as any).minOrderAmount ?? 0),
          };
          setStore(storeInfo as Store);
          setCartStore(storeInfo as any);
        }
        
        // Fetch products for this store
        const productsResponse = await fetch(`${baseUrl}/products/store/${storeId}`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const productsList = Array.isArray(productsData) ? productsData : (productsData.data || []);
          setProducts(productsList);
          if (productsList.length > 0) {
            setSelectedCategory(productsList[0].category);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching store/products:', err);
        setError('Erreur lors du chargement des données');
        // Fallback to mock data for testing
        setStore(mockStore);
        setProducts(mockProducts);
        setCartStore(mockStore);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndProducts();
  }, [storeId, setCartStore]);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">{error || 'Magasin non trouvé'}</p>
        </div>
        <Link href="/stores">
          <Button>Retour aux magasins</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 bg-gray-200">
        {store.image ? (
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
            <span className="text-white text-6xl">🍕</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link
          href="/stores"
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  store.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {store.isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl">{store.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900">{(((typeof (store as any).rating === 'number' ? (store as any).rating : (store as any).rating?.average || 0) as number)).toFixed(1)}</span>
                  <span>({(store as any).reviewCount ?? 0} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{store.estimatedDeliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address.street}, {store.address.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-gray-500">
                Livraison: {Number(((store as any).deliveryFee ?? 0)) === 0 ? 'Gratuite' : `${Number(((store as any).deliveryFee ?? 0)).toFixed(2)} €`}
              </div>
              <div className="text-sm text-gray-500">
                Minimum: {`${Number(((store as any).minOrderAmount ?? 0)).toFixed(2)} €`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="sticky top-20 bg-gray-50 py-4 -mx-4 px-4 mb-4 overflow-x-auto">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById(`category-${category}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 pb-24">
              {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <div key={category} id={`category-${category}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                  <div className="grid gap-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-80">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Mon panier
              </h3>
              {itemCount === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Votre panier est vide
                </p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    {itemCount} article{itemCount > 1 ? 's' : ''} dans le panier
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">{getTotal().toFixed(2)} €</span>
                  </div>
                  <Link href="/cart">
                    <Button fullWidth>Voir le panier</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {itemCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium flex items-center justify-between px-4"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{itemCount} article{itemCount > 1 ? 's' : ''}</span>
            </span>
            <span>{getTotal().toFixed(2)} €</span>
          </button>
        </div>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
