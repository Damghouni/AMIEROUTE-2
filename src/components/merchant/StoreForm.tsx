'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Category {
  _id: string;
  name: string;
}

interface StoreFormData {
  name: string;
  description: string;
  category: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
}

interface StoreFormProps {
  initialData?: StoreFormData;
  onSubmit: (data: StoreFormData) => Promise<void>;
  isLoading?: boolean;
}

const countries = ['France', 'Belgique', 'Suisse', 'Allemagne', 'Italie', 'Espagne'];

export default function StoreForm({ initialData, onSubmit, isLoading }: StoreFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StoreFormData>(
    initialData || {
      name: '',
      description: '',
      category: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
      },
      phone: '',
      email: '',
    }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const token = localStorage.getItem('auth_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const url = `${baseUrl}/categories`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          setCategories([]);
          return;
        }

        const result = await response.json();
        console.log('Categories API response:', result);
        
        // Gérer la réponse correctement
        let categoriesData = [];
        if (Array.isArray(result)) {
          categoriesData = result;
        } else if (result.data && Array.isArray(result.data)) {
          categoriesData = result.data;
        } else if (result.categories && Array.isArray(result.categories)) {
          categoriesData = result.categories;
        }
        
        console.log('Parsed categories:', categoriesData);
        console.log('Categories count:', categoriesData.length);
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1] as keyof typeof formData.address;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <Input
            label="Nom du magasin"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Ma Boutique"
            required
          />
        </div>

        {/* Description */}
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
            placeholder="Décrivez votre magasin..."
          />
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie de magasin
          </label>
          {loadingCategories ? (
            <div className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500">
              Chargement des catégories...
            </div>
          ) : categories.length === 0 ? (
            <div className="block w-full rounded-lg border border-orange-300 px-3 py-2 bg-orange-50 text-orange-600">
              Aucune catégorie disponible
            </div>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat: any) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Address Section */}
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-900">Adresse</h3>

        <div className="md:col-span-2">
          <Input
            label="Rue et numéro"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            placeholder="Ex: 123 Rue de la Paix"
            required
          />
        </div>

        <Input
          label="Ville"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          placeholder="Ex: Paris"
          required
        />

        <Input
          label="Code postal"
          name="address.postalCode"
          value={formData.address.postalCode}
          onChange={handleChange}
          placeholder="Ex: 75001"
          required
        />

        <select
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* Contact Section */}
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-900">Coordonnées</h3>

        <Input
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ex: +33 1 23 45 67 89"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contact@magasin.fr"
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Mettre à jour' : 'Créer le magasin'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
