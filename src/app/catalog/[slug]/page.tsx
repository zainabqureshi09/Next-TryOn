import ProductCard from "@/app/components/ProductCard";

async function getProductsByCategory(category: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`);
  // client-side filtering fallback if API doesn't filter
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  const all = await res.json();
  return all.filter((p: any) => (p.category || "").toLowerCase() === category.toLowerCase());
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug);
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">{params.slug.replace(/-/g, " ").toUpperCase()}</h1>
      {products.length === 0 ? (
        <p>No products in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p: any) => (
            <ProductCard key={p._id} id={p._id} name={p.name} price={p.price} image={p.image || "/next.svg"} />
          ))}
        </div>
      )}
    </section>
  );
}

