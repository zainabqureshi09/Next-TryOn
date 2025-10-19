import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = Product & {
  qty: number;
  id: string;
  _id?: string;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Cart actions
  addItem: (product: Product, qty?: number) => Promise<void>;
  updateItem: (id: string, qty: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  decrement: (id: string) => Promise<void>;
  clear: () => Promise<void>;

  // Computed values
  count: () => number;
  subtotal: () => number;

  // Internal helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItems: (items: CartItem[]) => void;
  syncWithApi: () => Promise<void>;
};

// ===============================
// ✅ Zustand Cart Implementation
// ===============================
const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setItems: (items) => set({ items }),

      // ✅ Sync cart from backend (optional)
      syncWithApi: async () => {
        const { setLoading, setError, setItems } = get();
        if (get().isLoading) return; // Prevent concurrent syncs
        
        setLoading(true);
        try {
          const res = await fetch("/api/cart", {
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!res.ok) throw new Error("Failed to fetch cart data");

          const data = await res.json();
          if (data?.success && Array.isArray(data.cart)) {
            // Merge local and server state intelligently
            const localItems = get().items;
            const serverItems = data.cart;
            
            // Use server as source of truth but preserve local changes if any
            if (JSON.stringify(localItems) !== JSON.stringify(serverItems)) {
              setItems(serverItems);
            }
          }
          setError(null);
        } catch (err) {
          console.warn("Cart sync failed, using local state:", err);
          // Don't show error to user for sync failures, just log it
        } finally {
          setLoading(false);
        }
      },

      // ✅ Add item to cart
      addItem: async (product, qty = 1) => {
        const { items, setLoading, setError } = get();
        setLoading(true);

        try {
          const productId = product.id || product._id;
          if (!productId) throw new Error("Invalid product ID");

          const existing = items.find(
            (i) => i.id === productId || i._id === productId
          );

          if (existing) {
            await get().updateItem(productId, existing.qty + qty);
            return;
          }

          const newItem: CartItem = {
            ...product,
            id: productId,
            _id: productId,
            qty,
            image: product.image || "",
          };

          // Persist to backend (if available)
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to add item");
          }

          set((state) => ({
            items: [...state.items, newItem],
            error: null,
          }));
        } catch (err: any) {
          console.error("Add item error:", err);
          setError(err.message || "Failed to add item");
        } finally {
          setLoading(false);
        }
      },

      // ✅ Update item quantity
      updateItem: async (id, qty) => {
        const { setLoading, setError, items } = get();
        const original = [...items];

        if (qty <= 0) {
          return get().removeItem(id); // Delegate to removeItem for consistency
        }

        // Optimistic update
        set((s) => ({
          items: s.items.map((i) =>
            (i.id === id || i._id === id)
              ? { ...i, qty: Math.max(1, Math.min(qty, 99)) }
              : i
          ),
        }));

        // Skip API call if offline or in development without backend
        try {
          const res = await fetch("/api/cart", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: get().items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                image: item.image,
              }))
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to update cart on server");
          }
          setError(null);
        } catch (err: any) {
          console.warn("Cart sync failed, keeping local changes:", err);
          // Don't revert for offline scenarios - keep optimistic update
        } finally {
          setLoading(false);
        }
      },

      // ✅ Remove item
      removeItem: async (id) => {
        const { setLoading, setError } = get();
        const original = [...get().items];

        set((s) => ({
          items: s.items.filter((i) => i.id !== id && i._id !== id),
        }));

        setLoading(true);
        try {
          const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to remove item");
          }
          setError(null);
        } catch (err: any) {
          console.error("Remove item error:", err);
          setError(err.message || "Failed to remove item");
          set({ items: original }); // revert
        } finally {
          setLoading(false);
        }
      },

      // ✅ Decrement item quantity
      decrement: async (id) => {
        const item = get().items.find((i) => i.id === id || i._id === id);
        if (item) {
          await get().updateItem(id, item.qty - 1);
        }
      },

      // ✅ Clear entire cart
      clear: async () => {
        const { setLoading, setError } = get();
        const original = [...get().items];
        set({ items: [] }); // optimistic

        setLoading(true);
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [] }),
          });
          if (!res.ok) throw new Error("Failed to clear cart");
          setError(null);
        } catch (err: any) {
          console.error("Clear cart error:", err);
          setError(err.message || "Failed to clear cart");
          set({ items: original }); // revert
        } finally {
          setLoading(false);
        }
      },

      // ✅ Computed properties
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.qty * (Number(i.price) || 0),
          0
        ),
    }),
    {
      name: "cart-store",
      version: 1,
      partialize: (state) => ({
        items: state.items,
      }), // persist only items
    }
  )
);

export default useCart;
