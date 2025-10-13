"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { params: { slug: string } };

const slugToTitle: Record<string, string> = {
  men: "Men",
  women: "Women",
  sunglasses: "Sunglasses",
};

// Map catalog slug -> shop category slug for deep link
const slugToShopCategory: Record<string, string> = {
  men: "prescription",
  women: "prescription",
  sunglasses: "sunglasses",
};

const dummyItems: Record<
  string,
  { id: string; price: number; image?: string }[]
> = {
  men: [
    { id: "m1", price: 119.99, image: "/assets/homeMen.jpg" },
    { id: "m2",  price: 139.99, image: "/assets/frame1.jpg" },
    { id: "m3",  price: 89.99, image: "/assets/slide2home.jpg" },
  ],
  women: [
    { id: "w1", price: 129.99, image: "/assets/slideHome.jpg" },
    { id: "w2", price: 99.99, image: "/assets/female.jpg" },
    { id: "w3",  price: 199.99, image: "/assets/frame2.jpg" },
  ],
  sunglasses: [
    { id: "s1", price: 149.99, image: "/assets/frame1.jpg" },
    { id: "s2", price: 99.99, image: "/assets/slide2home.jpg" },
    { id: "s3", price: 159.99, image: "/assets/slide3.jpg" },
  ],
};

export default function CatalogSlugPage({ params }: Props) {
  const title =
    slugToTitle[params.slug] ||
    params.slug.replace(/-/g, " ").toUpperCase();
  const items = dummyItems[params.slug] || [];

  // cart state
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (id: string) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
      alert("✅ Item added to cart!");
    } else {
      alert("⚠️ Already in cart!");
    }
  };

  const addToWishlist = (id: string) => {
    if (!wishlist.includes(id)) {
      setWishlist([...wishlist, id]);
      alert("💜 Added to wishlist!");
    } else {
      alert("⚠️ Already in wishlist!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">{title}</h1>
      <div className="mb-6">
        <Link
          href={`/shop${
            slugToShopCategory[params.slug]
              ? `?category=${slugToShopCategory[params.slug]}`
              : ""
          }`}
          className="inline-block px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
        >
          Shop this category
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="space-y-4">
          <p className="text-gray-600">No items in this category yet.</p>
          <Link href="/catalog" className="text-purple-700 hover:underline">
            ← Back to Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <div
              key={p.id}
              className="rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-56 bg-gray-100">
                <Image
                  src={p.image || "/assets/slide3.jpg"}
                  alt={p.id}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{p.id}</h3>
                <p className="text-purple-700 font-bold">${p.price.toFixed(2)}</p>

                <div className="flex gap-2">
                  {/* View details */}
                  <Link href={`/product/${p.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>

                  {/* Add to cart */}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => addToCart(p.id)}
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* Wishlist */}
                <Button
                  variant="ghost"
                  className="w-full text-sm text-gray-600"
                  onClick={() => addToWishlist(p.id)}
                >
                  ❤️ Add to Wishlist
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Cart + Wishlist Summary */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
        <p className="text-sm text-gray-600">{cart.join(", ") || "No items yet"}</p>

        <h2 className="mt-4 text-xl font-bold">Wishlist ({wishlist.length})</h2>
        <p className="text-sm text-gray-600">{wishlist.join(", ") || "No items yet"}</p>
      </div>
    </div>
  );
}
