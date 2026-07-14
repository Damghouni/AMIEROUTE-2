'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Store, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Store {
  _id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  phone: string;
}

export default function StoresPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        if (user?.id) {
          const response = await api.get(`/stores/merchant/${user.id}`);
          setStores(response.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Erreur lors du chargement des magasins');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchStores();
    }
  }, [user?.id]);

  const handleDelete = async (storeId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce magasin?')) {
      try {
        await api.delete(`/stores/${storeId}`);
        setStores(stores.filter((store) => store._id !== storeId));
        toast.success('Magasin supprimé');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-8 h-8" />
            Mes magasins
          </h1>
          <p className="text-gray-500">Gérez vos magasins et points de vente</p>
        </div>
        <Button
          onClick={() => router.push('/merchant/stores/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Créer un magasin
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement des magasins...</p>
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de magasin</p>
              <Button
                onClick={() => router.push('/merchant/stores/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Créer mon premier magasin
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <Card key={store._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{store.name}</CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/merchant/store`)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(store._id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{store.description}</p>
                <div className="text-sm text-gray-500">
                  <p>{store.address.street}</p>
                  <p>
                    {store.address.postalCode} {store.address.city}
                  </p>
                  <p>{store.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
