"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Suspense } from "react";

function CheckoutContent() {
  const params = useSearchParams();
  const productId = params.get("productId");
  const product = products.find((p) => p.id === productId);
  const { addToCart, subtotal, items } = useCart();

  const selected: any = product || items[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Checkout</h1>

      {!selected ? (
        <div className="space-y-4">
          <p className="text-gray-600">No product selected.</p>
          <Link href="/shop" className="text-purple-700 hover:underline">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-6 space-y-6">
          <div className="flex gap-4">
            <div className="relative w-28 h-28 bg-gray-100 rounded overflow-hidden">
              <Image
                src={selected.image || "/assets/slide3.jpg"}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{selected.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{selected.description}</p>
              <p className="text-purple-700 font-bold mt-2">${selected.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!product && (
              <div className="text-sm text-gray-600">
                Cart subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            )}
            {product && (
              <button
                className="ml-auto px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            )}
            <button className="ml-auto px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
              Proceed to Payment
            </button>
          </div>

          <div className="pt-2">
            <Link href="/shop" className="text-purple-700 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-10">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
