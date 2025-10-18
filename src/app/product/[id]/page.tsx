"use client";

import { Product as ProductType } from "@/types";
import AddToCartButton from "@/app/components/AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import { VirtualTryOn } from "@/components/VirtualTryOn";

async function getProduct(id: string) {
  try {
    const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

interface ProductPageProps {
  params: { id: string };
}

function inferCategory(category?: string | null) {
  if (!category) return undefined;
  const lower = category.toLowerCase();
  if (lower.includes("men")) return "men";
  if (lower.includes("women")) return "women";
  if (lower.includes("sunglasses")) return "sunglasses";
  return undefined;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { t } = useTranslation();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(params.id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading)
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </section>
    );

  if (!product)
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-destructive">Product not found</p>
      </section>
    );

  // Normalize for cart system
  const normalized: ProductType = {
    id: product._id || product.id,
    name: product.name,
    image: product.image || product.secure_url || null,
    overlayImage: product.overlayImage || null,
    price: Number((product as any).price),
  } as unknown as ProductType;

  // Build image array
  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : product.secure_url
    ? [product.secure_url]
    : [];

  const mainSrc = images[0] || "/assets/slideHome.jpg";
  const category = inferCategory(product.category);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery + TryOn */}
        <div>
          {/* Main image with responsive aspect ratio */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl border overflow-hidden bg-muted">
            <Image
              src={mainSrc}
              alt={product.name || "Product"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnails: horizontal scroll on mobile, grid on larger screens */}
          {images.length > 1 && (
            <>
              <div className="mt-3 sm:hidden flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {images.slice(1).map((src: string, i: number) => (
                  <div key={i} className="relative w-28 h-20 rounded-md border overflow-hidden flex-shrink-0">
                    <Image src={src} alt={`${product.name || "Product"} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-3 hidden sm:grid grid-cols-5 gap-2">
                {images.slice(1).map((src: string, i: number) => (
                  <div key={i} className="relative w-full h-20 rounded-md border overflow-hidden">
                    <Image src={src} alt={`${product.name || "Product"} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Virtual Try-On: collapsed on mobile to avoid layout issues */}
          <details className="mt-6 lg:hidden group">
            <summary className="list-none cursor-pointer select-none rounded-lg border px-4 py-3 text-sm font-medium text-foreground/90 bg-card flex items-center justify-between">
              <span>Try on with your camera</span>
              <span className="text-xs text-muted-foreground">Tap to open</span>
            </summary>
            <div className="mt-3 rounded-lg border p-2">
              <VirtualTryOn />
            </div>
          </details>

          <div className="mt-6 hidden lg:block">
            <div className="rounded-lg border p-2">
              <VirtualTryOn />
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:sticky lg:top-24">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-3 sm:mb-4">
            {product.name}
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-purple-900 mb-4">
            ${Number((product as any).price).toFixed(2)}
          </p>

          {product.description && (
            <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <AddToCartButton product={normalized} />
            {category && (
              <Link
                href={`/catalog/${category}`}
                className="px-5 py-2 rounded-lg border border-purple-700 text-purple-700 hover:bg-purple-50 text-center"
              >
                Explore {category}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
