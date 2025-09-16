import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export const dynamic = "force-static";

export default function TryOnPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/shop" className="text-purple-700 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        Virtual Try-On for Glass: {product.name}
      </h1>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="relative w-full sm:w-1/2 h-72 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image || "/assets/slide3.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="sm:w-1/2 space-y-4">
          <p className="text-gray-700">{product.description}</p>
          <p className="text-purple-700 font-bold text-lg">${product.price.toFixed(2)}</p>
          <div className="text-sm text-gray-500">
            This is a placeholder. AR try-on will be integrated later.
          </div>
          <div className="pt-2">
            <Link
              href={`/checkout?productId=${product.id}`}
              className="inline-block px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/shop" className="text-purple-700 hover:underline">
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}


