import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/catalog";

export const metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="max-w-7xl mx-auto px-6 py-12 text-white">
          <h1 className="text-3xl font-extrabold tracking-tight">Catalog</h1>
          <p className="mt-2 text-white/90">Explore our curated categories.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={cat.image || "/assets/slideHome.jpg"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
