import { useCartStore } from '@/stores/cartStore';
import { Product, SelectedOption, Store } from '@/types';

export function useCart() {
  const {
    items,
    store,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setStore,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getItemCount,
  } = useCartStore();

  const handleAddItem = (
    product: Product,
    quantity: number = 1,
    selectedOptions?: SelectedOption[],
    productStore?: Store
  ) => {
    if (productStore) {
      setStore(productStore);
    }
    addItem(product, quantity, selectedOptions);
  };

  return {
    items,
    store,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    deliveryFee: getDeliveryFee(),
    total: getTotal(),
    addItem: handleAddItem,
    removeItem,
    updateQuantity,
    clearCart,
    setStore,
    isEmpty: items.length === 0,
  };
}
