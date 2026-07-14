'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FolderTree,
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/categories');
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Erreur lors du chargement des catégories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtrer les catégories selon la recherche
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        toast.success('Catégorie supprimée');
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
            <FolderTree className="w-8 h-8" />
            Catégories
          </h1>
          <p className="text-gray-500">Gérez les catégories de produits</p>
        </div>
        <Button
          onClick={() => router.push('/admin/categories/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Chargement des catégories...
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Aucune catégorie trouvée</p>
              <Button
                onClick={() => router.push('/admin/categories/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Créer la première catégorie
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category._id}>
              {category.image && (
                <div className="w-full h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  <div className="flex items-center gap-2">
                    {category.isActive ? (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    <span className="text-xs text-gray-500">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

