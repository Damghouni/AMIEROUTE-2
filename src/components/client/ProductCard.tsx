'use client';

import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      toast.error('Ce produit n\'est pas disponible');
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Card padding="none" className="overflow-hidden flex">
      <div className="flex-1 p-4">
        <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-semibold text-primary-600">
            {product.price.toFixed(2)} €
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className="!p-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {product.image && (
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!product.isAvailable && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <span className="text-gray-500 font-medium">Indisponible</span>
        </div>
      )}
    </Card>
  );
}
