'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { CategoryForm } from '@/components/admin';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { AlertCircle } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      toast.error('Vous devez être connecté en tant qu\'administrateur');
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    image?: string;
  }) => {
    setIsLoading(true);
    try {
      // Vérifier le token avant d'envoyer
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await api.post('/categories', data);

      if (response.data?.success) {
        toast.success('Catégorie créée avec succès!');
        router.push('/admin/categories');
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la création');
      }
    } catch (error: any) {
      let message = 'Erreur lors de la création de la catégorie';
      
      if (error.response?.status === 401) {
        message = 'Session expirée. Veuillez vous reconnecter.';
        localStorage.removeItem('auth_token');
        router.push('/login');
      } else if (error.response?.status === 403) {
        message = 'Vous n\'avez pas les permissions pour créer une catégorie.';
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      toast.error(message);
      console.error('Category creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un message de chargement pendant la vérification d'authentification
  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Vérification en cours...</h1>
      </div>
    );
  }

  // Afficher un message d'erreur si pas admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="space-y-6 max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-900 mb-2">Accès refusé</h2>
                <p className="text-red-800 mb-4">
                  Vous devez être connecté en tant qu'administrateur pour créer des catégories.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Aller à la connexion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle catégorie</h1>
        <p className="text-gray-500">Ajoutez une nouvelle catégorie de produits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
