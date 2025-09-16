"use client";

import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const { t } = useTranslation();
  
  return (
    <button
      onClick={() => addItem(product)}
      className="mt-6 px-6 py-3 bg-purple-700 text-white font-bold rounded-lg shadow-lg hover:bg-purple-800 transition"
    >
      {t('product.addToCart')}
    </button>
  );
}



