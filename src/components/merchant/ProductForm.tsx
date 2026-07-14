'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Store {
  id: string;
  _id: string;
  name: string;
  owner: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  store: string;
  isAvailable: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

const categories = [
  'Entrées',
  'Plats',
  'Desserts',
  'Boissons',
  'Snacks',
  'Autres',
];

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image: '',
      store: '',
      isAvailable: true,
    }
  );
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

  // Récupérer les stores de l'utilisateur connecté
  useEffect(() => {
    const fetchUserStores = async () => {
      try {
        if (!user?.id) {
          console.warn('User ID not available');
          setLoadingStores(false);
          return;
        }

        setLoadingStores(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.warn('No authentication token found');
          setLoadingStores(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/stores/merchant/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText);
          setStores([]);
          return;
        }

        const data = await response.json();
        
        // Gérer la réponse correctement
        let storesData = [];
        if (Array.isArray(data)) {
          storesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          storesData = data.data;
        }
        
        console.log('Stores fetched:', storesData);
        setStores(storesData);
        
        // Si c'est une création et qu'il y a un store, le sélectionner par défaut
        if (!initialData && storesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            store: storesData[0]._id || storesData[0].id,
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des stores:', error);
        setStores([]);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchUserStores();
  }, [user?.id, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner votre magasin *
          </label>
          {loadingStores ? (
            <div className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500">
              Chargement des magasins...
            </div>
          ) : stores.length === 0 ? (
            <div className="block w-full rounded-lg border border-red-300 px-3 py-2 bg-red-50">
              <p className="text-red-600 mb-3">Aucun magasin trouvé. Veuillez créer un magasin d'abord.</p>
              <button
                type="button"
                onClick={() => router.push('/merchant/stores/new')}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Créer un magasin
              </button>
            </div>
          ) : (
            <select
              name="store"
              value={formData.store}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Sélectionner un magasin</option>
              {stores.map((store) => (
                <option key={store._id || store.id} value={store._id || store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="md:col-span-2">
          <Input
            label="Nom du produit"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Pizza Margherita"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Décrivez votre produit..."
          />
        </div>

        <Input
          label="Prix (€)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <div className="md:col-span-2 flex items-center gap-4">
          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
            className="flex-1"
          />
          <div className="flex items-center gap-3 pt-7">
             <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
              Disponible
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image du produit
          </label>
          {previewImage ? (
            <div className="relative w-48 h-48">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">
                  Cliquez pour uploader une image
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}