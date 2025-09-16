"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type CartItem = Product & { qty: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("cart-items") : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart-items", JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  const addToCart = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.qty * it.price, 0), [items]);
  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value: CartContextValue = { items, addToCart, removeFromCart, clearCart, subtotal, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
