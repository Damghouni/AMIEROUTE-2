'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { constants } from 'buffer';

interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  storeId?: string;
}

export default function ProductsPage() {
  //const { user, storeId } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storeId = "69714824602db3e0a7888e4a"
  useEffect(() => {
    console.log(storeId);
    
    const fetchProducts = async () => {

      try {
        if (!storeId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('auth_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        
        const response = await fetch(`${baseUrl}/products/store/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
       console.log(response);

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }

        const data = await response.json();
        const productsData = Array.isArray(data) ? data : (data.data || []);
        
        setProducts(productsData);
        console.log(data);
        
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const token = localStorage.getItem('auth_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        
        const response = await fetch(`${baseUrl}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      } catch (err) {
        console.error('Erreur:', err);
        alert('Impossible de supprimer le produit');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500">Gérez votre catalogue de produits</p>
        </div>
        <Link href="/merchant/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          Chargement des produits...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          IMG
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/merchant/products/${product._id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun produit trouvé
            </div>
          )}
        </Card>
      )}
    </div>
  );
}