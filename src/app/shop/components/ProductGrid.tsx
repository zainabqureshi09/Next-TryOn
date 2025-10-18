"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/contexts/CartContext";
import type { Product } from "@/data/products";
import { ShoppingCart, Eye } from 'lucide-react';

// ... (keep the rest of the imports)

// ... (keep the Product type)

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCartContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product._id || product.id}
          className="group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <Link href={`/product/${product.id}`} className="block aspect-square w-full overflow-hidden">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-semibold text-lg text-gray-800 truncate">
              <Link href={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="font-bold text-xl text-purple-700 mt-2">${product.price.toFixed(2)}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex items-center justify-between">
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center w-1/2 bg-purple-600 text-white px-4 py-2 rounded-l-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-center w-1/2 bg-gray-200 text-gray-800 px-4 py-2 rounded-r-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}