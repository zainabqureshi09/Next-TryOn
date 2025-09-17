import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/catalog";

export const metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={cat.image || "/assets/slideHome.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              {cat.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{cat.description}</p>
              )}
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
