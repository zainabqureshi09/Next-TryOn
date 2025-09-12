import { Product as ProductType } from "@/types";
import AddToCartButton from "@/app/components/AddToCartButton";
import Link from "next/link";
import VirtualTryOn from "@/app/components/VirtualTryon";

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  if (!product) return <p>Product not found</p> as any;

  const normalized: ProductType = {
    id: product._id || product.id,
    name: product.name,
    price: product.price,
    image: product.image || null,
    overlayImage: product.overlayImage || null,
  };

  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

  const frameId = inferFrameId(product.overlayImage || product.image);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Gallery + TryOn */}
        <div>
          {images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.name} className="w-full h-96 object-cover rounded-xl border" />
          ) : null}

          {images && images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(1).map((src: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${product.name} ${i + 2}`} className="h-20 w-full object-cover rounded-md border" />
              ))}
            </div>
          )}

          <div className="mt-6">
            <VirtualTryOn productImage={product.overlayImage || product.image || ""} useCamera={false} userImageSrc={null} scaleFactor={0} verticalOffset={0} />
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl font-bold text-purple-700 mb-4">{product.name}</h1>
          <p className="text-xl font-semibold text-purple-900 mb-4">${product.price.toFixed(2)}</p>
          {product.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <AddToCartButton product={normalized} />
            {frameId && (
              <Link
                href={`/tryon?overlay=${frameId}`}
                className="px-5 py-2 rounded-lg border border-purple-700 text-purple-700 hover:bg-purple-50"
              >
                Try-On
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
