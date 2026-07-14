import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, SelectedOption, Store } from '@/types';

interface CartState {
  items: CartItem[];
  store: Store | null;
  addItem: (product: Product, quantity: number, selectedOptions?: SelectedOption[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setStore: (store: Store) => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const calculateItemPrice = (product: Product, quantity: number, selectedOptions?: SelectedOption[]): number => {
  let price = product.price;
  
  if (selectedOptions && product.options) {
    selectedOptions.forEach((selected) => {
      const option = product.options?.find((o) => o.id === selected.optionId);
      if (option) {
        selected.choiceIds.forEach((choiceId) => {
          const choice = option.choices.find((c) => c.id === choiceId);
          if (choice) {
            price += choice.price;
          }
        });
      }
    });
  }
  
  return price * quantity;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      store: null,

      addItem: (product, quantity, selectedOptions) => {
        const { items, store } = get();
        
        if (store && store.id !== product.storeId) {
          set({ items: [], store: null });
        }

        const existingItemIndex = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity,
            totalPrice: calculateItemPrice(product, newQuantity, selectedOptions),
          };
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            product,
            quantity,
            selectedOptions,
            totalPrice: calculateItemPrice(product, quantity, selectedOptions),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        const updatedItems = items.filter((item) => item.product.id !== productId);
        set({ items: updatedItems });
        
        if (updatedItems.length === 0) {
          set({ store: null });
        }
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = items.map((item) => {
          if (item.product.id === productId) {
            return {
              ...item,
              quantity,
              totalPrice: calculateItemPrice(item.product, quantity, item.selectedOptions),
            };
          }
          return item;
        });
        
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], store: null });
      },

      setStore: (store) => {
        set({ store });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getDeliveryFee: () => {
        const { store } = get();
        return store?.deliveryFee || 0;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
