"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";

function ShopContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const selectedCategory = params.get("category");
  const filtered = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Shop</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1.5 rounded border text-sm ${!selectedCategory ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 hover:bg-gray-100"}`}
            onClick={() => router.push("/shop")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`px-3 py-1.5 rounded border text-sm ${selectedCategory === cat.slug ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 hover:bg-gray-100"}`}
              onClick={() => router.push(`/shop?category=${cat.slug}`)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-56 bg-gray-100">
                <Image
                  src={p.image || "/assets/slide3.jpg"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                <p className="text-purple-700 font-bold">${p.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/tryon/${p.id}`}
                    className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Try On
                  </Link>
                  <button
                    className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/checkout?productId=${p.id}`}
                    className="ml-auto px-3 py-2 text-sm rounded bg-purple-700 text-white hover:bg-purple-800"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
