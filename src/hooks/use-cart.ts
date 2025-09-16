import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p: Product) =>
        set((s) => {
          const idx = s.items.findIndex((i) => i.id === p.id);
          if (idx >= 0) {
            const items = [...s.items];
            items[idx].qty += 1;
            return { items };
          }
          return { items: [...s.items, { ...p, qty: 1 }] };
        }),
      removeItem: (id: string) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      decrement: (id: string) =>
        set((s) => {
          const idx = s.items.findIndex((i) => i.id === id);
          if (idx === -1) return { items: s.items };
          const items = [...s.items];
          const nextQty = items[idx].qty - 1;
          if (nextQty <= 0) {
            items.splice(idx, 1);
          } else {
            items[idx] = { ...items[idx], qty: nextQty };
          }
          return { items };
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.qty * (item.price || 0), 0),
    }),
    { name: "cart-store" }
  )
);

export default useCart;
