'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProductForm } from '@/components/merchant';
import Card from '@/components/ui/Card';
import { productApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    store: string;
  }) => {
    setIsLoading(true);
    try {
      if (!data.store) {
        throw new Error('Veuillez sélectionner un magasin');
      }
      
      // Utiliser le store sélectionné dans le formulaire
      await productApi.create({ 
        ...data, 
        store: data.store 
      });
      
      toast.success('Produit créé avec succès');
      router.push('/merchant/products');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du produit';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau produit</h1>
        <p className="text-gray-500">Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      <Card className="max-w-2xl">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}