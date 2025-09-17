"use client";

import { Product as ProductType } from "@/types";
import AddToCartButton from "@/app/components/AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import VirtualTryOn from "@/components/VirtualTryOn";

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

function inferFrameId(overlayUrl?: string | null) {
  if (!overlayUrl) return undefined;
  const lower = overlayUrl.toLowerCase();
  if (lower.includes("aviator")) return "aviator";
  if (lower.includes("bluelight") || lower.includes("blue")) return "bluelight";
  if (lower.includes("round")) return "round";
  if (lower.includes("classic")) return "classic";
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

  if (loading) return <p>{t("common.loading")}</p>;
  if (!product) return <p>Product not found</p>;

  // Normalize for cart system
  const normalized: ProductType = {
    id: product._id || product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image || product.secure_url || null,
    overlayImage: product.overlayImage || null,
  };

  // Handle multiple / single images from DB
  const images: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : product.secure_url
      ? [product.secure_url]
      : [];

  const frameId = inferFrameId(product.overlayImage || product.image);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Gallery + TryOn */}
        <div>
          {images.length > 0 && (
            <Image
              src={images[0]}
              alt={product.name || "Product"}
              width={600}
              height={400}
              className="w-full h-96 object-cover rounded-xl border"
              priority
            />
          )}

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(1).map((src: string, i: number) => (
                <Image
                  key={i}
                  src={src}
                  alt={`${product.name || "Product"} ${i + 2}`}
                  width={120}
                  height={80}
                  className="h-20 w-full object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <VirtualTryOn
              productImage={product.overlayImage || product.image || ""}
              useCamera={false}
              userImageSrc={null}
              scaleFactor={1}
              verticalOffset={0}
            />
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl font-bold text-purple-700 mb-4">
            {product.name}
          </h1>
          <p className="text-xl font-semibold text-purple-900 mb-4">
            ${Number(product.price).toFixed(2)}
          </p>
          {product.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            <AddToCartButton product={normalized} />
            {frameId && (
              <Link
                href={`/tryon?overlay=${frameId}`}
                className="px-5 py-2 rounded-lg border border-purple-700 text-purple-700 hover:bg-purple-50"
              >
                {t("product.tryOn")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
