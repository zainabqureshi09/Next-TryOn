import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku?: string;
  options?: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateItem: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  
  // Sync with API
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

// Helper functions
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.qty, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,
      isLoading: false,
      error: null,

      addItem: (newItem) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
          
          let updatedItems;
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              qty: updatedItems[existingItemIndex].qty + newItem.qty
            };
          } else {
            // Add new item
            updatedItems = [...state.items, newItem];
          }
          
          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          };
        });
        
        // Sync with backend
        get().syncCart();
      },
      
      updateItem: (id, qty) => {
        set((state) => {
          if (qty <= 0) {
            // Remove item if quantity is 0 or less
            const updatedItems = state.items.filter(item => item.id !== id);
            return {
              items: updatedItems,
              subtotal: calculateSubtotal(updatedItems),
              itemCount: calculateItemCount(updatedItems),
            };
          }
          
          // Update quantity
          const updatedItems = state.items.map(item => 
            item.id === id ? { ...item, qty } : item
          );
          
          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          };
        });
        
        // Sync with backend
        get().syncCart();
      },
      
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.id !== id);
          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          };
        });
        
        // Sync with backend
        get().syncCart();
      },
      
      clearCart: () => {
        set({ items: [], subtotal: 0, itemCount: 0 });
        
        // Sync with backend
        get().syncCart();
      },
      
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/cart');
          if (!response.ok) throw new Error('Failed to fetch cart');
          
          const data = await response.json();
          if (data.success) {
            set({ 
              items: data.cart, 
              subtotal: data.subtotal,
              itemCount: data.itemCount,
              isLoading: false 
            });
          } else {
            throw new Error(data.error || 'Failed to fetch cart');
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false 
          });
        }
      },
      
      syncCart: async () => {
        try {
          const { items } = get();
          
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to sync cart');
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sync with server'
          });
        }
      }
    }),
    {
      name: 'virtual-eyewear-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);