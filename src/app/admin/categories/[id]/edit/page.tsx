'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CategoryForm } from '@/components/admin';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  // Charger les données de la catégorie
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsFetching(true);
        const response = await api.get(`/categories/${categoryId}`);
        const data = response.data?.data || response.data;
        setInitialData(data);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Erreur lors du chargement de la catégorie');
        router.push('/admin/categories');
      } finally {
        setIsFetching(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    image?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/categories/${categoryId}`, data);

      if (response.data?.success || response.status === 200) {
        toast.success('Catégorie mise à jour avec succès!');
        router.push('/admin/categories');
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour de la catégorie';
      toast.error(message);
      console.error('Category update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Chargement...</h1>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Catégorie non trouvée</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifier une catégorie</h1>
        <p className="text-gray-500">Modifiez les informations de la catégorie</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
