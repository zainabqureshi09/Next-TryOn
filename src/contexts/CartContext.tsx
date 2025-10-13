"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";
import type { Product } from "@/data/products";
import useCart, { CartItem } from "@/hooks/use-cart";
import toast from "react-hot-toast";

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  count: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const {
    items,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    clear,
    subtotal,
    count,
    syncWithApi,
  } = useCart();

  // ✅ Sync cart with API when mounted
  useEffect(() => {
    let mounted = true;
    const syncCart = async () => {
      try {
        if (mounted && typeof syncWithApi === "function") {
          await syncWithApi();
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };
    syncCart();
    return () => {
      mounted = false;
    };
  }, [syncWithApi]);

  // ✅ Add item to cart
  const addToCart = useCallback(
    async (product: Product, qty: number = 1) => {
      if (!product?.id || !product?.name || typeof product?.price !== "number") {
        toast.error("Invalid product — cannot add to cart.");
        return;
      }

      try {
        await addItem(product, qty);
        toast.success(`${product.name} added to your cart.`);
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add item to cart.");
      }
    },
    [addItem]
  );

  // ✅ Update item quantity
  const updateQuantity = useCallback(
    async (id: string, qty: number) => {
      try {
        await updateItem(id, qty);
        toast.success("Cart updated successfully.");
      } catch (error) {
        console.error("Update quantity error:", error);
        toast.error("Failed to update quantity.");
      }
    },
    [updateItem]
  );

  // ✅ Remove item
  const removeFromCart = useCallback(
    async (id: string) => {
      try {
        await removeItem(id);
        toast.success("Item removed from your cart.");
      } catch (error) {
        console.error("Remove from cart error:", error);
        toast.error("Failed to remove item from cart.");
      }
    },
    [removeItem]
  );

  // ✅ Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      await clear();
      toast.success("All items removed from your cart.");
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart.");
    }
  }, [clear]);

  const value: CartContextValue = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal: typeof subtotal === "function" ? subtotal() : subtotal,
    count: typeof count === "function" ? count() : count,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
