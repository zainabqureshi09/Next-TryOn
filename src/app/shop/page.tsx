import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { categories } from "@/data/catalog";
import Product from "@/lib/models/Product";
import dbConnect from "@/lib/mongodb";
import ProductGrid from "./components/ProductGrid";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ShopContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedCategory = searchParams.category;
  
  // Connect to database
  await dbConnect();
  
  // Fetch products from database with optional category filter
  const query = {
    isActive: true,
    ...(selectedCategory ? { category: selectedCategory } : {})
  };
  
  const products = await Product.find(query).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Shop</h1>
        <div className="flex gap-2 flex-wrap">
          <Link 
            href="/shop"
            className={`px-3 py-1.5 rounded border text-sm ${!selectedCategory ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 hover:bg-gray-100"}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className={`px-3 py-1.5 rounded border text-sm ${selectedCategory === cat.slug ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 hover:bg-gray-100"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

export default function ShopPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10">Loading...</div>}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}
