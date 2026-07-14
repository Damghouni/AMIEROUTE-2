'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProductForm } from '@/components/merchant';
import Card from '@/components/ui/Card';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

const mockProduct: ProductData = {
  name: 'Pizza Margherita',
  description: 'Tomate, mozzarella, basilic frais',
  price: 12.50,
  category: 'Plats',
  stock: 20,
  image: '',
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setProduct(mockProduct);
    }, 500);
  }, [params.id]);

  const handleSubmit = async (data: ProductData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Produit mis à jour avec succès');
      router.push('/merchant/products');
    } catch {
      toast.error('Erreur lors de la mise à jour du produit');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le produit</h1>
        <p className="text-gray-500">Modifiez les informations du produit</p>
      </div>

      <Card className="max-w-2xl">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
