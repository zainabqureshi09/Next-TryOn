"use client";

import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const isLoading = useCart((s) => s.isLoading);
  const { t } = useTranslation();
  
  const handleAddToCart = async () => {
    await addItem(product as any);
  };
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`mt-6 px-6 py-3 ${isLoading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'} text-white font-bold rounded-lg shadow-lg transition`}
    >
      {isLoading ? t('common.loading') || 'Adding...' : t('product.addToCart') || 'Add to Cart'}
    </button>
  );
}



