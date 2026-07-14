'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Address } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    store, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getSubtotal, 
    getDeliveryFee, 
    getTotal 
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [notes, setNotes] = useState('');

  const handleAddressChange = (field: keyof Address, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return deliveryAddress.street && deliveryAddress.city && deliveryAddress.postalCode;
  };

  const handleSubmitOrder = async () => {
    if (!isAddressValid()) {
      toast.error('Veuillez remplir l\'adresse de livraison');
      return;
    }

    if (store && getSubtotal() < store.minOrderAmount) {
      toast.error(`Commande minimum de ${store.minOrderAmount.toFixed(2)} € requise`);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const orderId = `ORD-${Date.now()}`;
      
      toast.success('Commande passée avec succès !');
      clearCart();
      router.push(`/orders/${orderId}`);
    } catch (error) {
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-600 mb-8">
          Découvrez nos restaurants et commencez votre commande
        </p>
        <Link href="/stores">
          <Button size="lg">Parcourir les restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={store ? `/stores/${store.id}` : '/stores'}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au restaurant
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon panier</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {store && (
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  🏪
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500">
                    Livraison: {store.estimatedDeliveryTime}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Articles ({items.length})</h2>
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <span className="font-semibold">{item.totalPrice.toFixed(2)} €</span>
                      </div>
                      {item.product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {item.product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Adresse de livraison</h2>
            </div>
            <div className="grid gap-4">
              <Input
                label="Adresse"
                placeholder="123 Rue de la Livraison"
                value={deliveryAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Code postal"
                  placeholder="75001"
                  value={deliveryAddress.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  required
                />
                <Input
                  label="Ville"
                  placeholder="Paris"
                  value={deliveryAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions de livraison (optionnel)
                </label>
                <textarea
                  rows={3}
                  placeholder="Code d'entrée, étage, instructions particulières..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{getSubtotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span>{getDeliveryFee() === 0 ? 'Gratuit' : `${getDeliveryFee().toFixed(2)} €`}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{getTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {store && getSubtotal() < store.minOrderAmount && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Ajoutez encore {(store.minOrderAmount - getSubtotal()).toFixed(2)} € pour atteindre le minimum de commande
                  </p>
                </div>
              )}

              <Button
                fullWidth
                size="lg"
                onClick={handleSubmitOrder}
                isLoading={isSubmitting}
                disabled={!isAddressValid() || !!(store && getSubtotal() < store.minOrderAmount)}
              >
                Passer la commande
              </Button>

              <button
                onClick={clearCart}
                className="w-full mt-3 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Vider le panier
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
