"use client";

import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  return (
    <button
      onClick={() => addItem(product)}
      className="mt-6 px-6 py-3 bg-purple-700 text-white font-bold rounded-lg shadow-lg hover:bg-purple-800 transition"
    >
      Add to Cart
    </button>
  );
}

