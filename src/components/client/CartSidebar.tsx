'use client';

import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, store, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Mon panier</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Votre panier est vide</p>
            <Button onClick={onClose}>Continuer mes achats</Button>
          </div>
        ) : (
          <>
            {store && (
              <div className="px-4 py-2 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  Commande chez <span className="font-medium">{store.name}</span>
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`}
                  className="flex gap-3 pb-4 border-b last:border-b-0"
                >
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-primary-600 font-semibold text-sm mt-1">
                      {item.totalPrice.toFixed(2)} €
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span>{getSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frais de livraison</span>
                <span>{getDeliveryFee() === 0 ? 'Gratuit' : `${getDeliveryFee().toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{getTotal().toFixed(2)} €</span>
              </div>
              <Link href="/cart" onClick={onClose}>
                <Button fullWidth size="lg">
                  Voir le panier
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
