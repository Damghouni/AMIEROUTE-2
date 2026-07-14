'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { StoreForm } from '@/components/merchant';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';

export default function NewStorePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
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
  }) => {
    setIsLoading(true);
    try {
      // Les champs category, phone, email nécessitent une structure différente selon le backend
      const storeData = {
        name: data.name,
        description: data.description,
        category: data.category, // À adapter si c'est une catégorie ObjectId
        address: {
          street: data.address.street,
          city: data.address.city,
          postalCode: data.address.postalCode,
          country: data.address.country,
        },
        phone: data.phone,
        email: data.email,
      };

      const response = await api.post('/stores', storeData);

      if (response.data?.success) {
        toast.success('Magasin créé avec succès!');
        router.push('/merchant/dashboard');
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la création');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du magasin';
      toast.error(message);
      console.error('Store creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau magasin</h1>
        <p className="text-gray-500">Ajoutez un nouveau magasin à votre portefeuille</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du magasin</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
