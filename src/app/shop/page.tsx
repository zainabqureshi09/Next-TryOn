import ProductCard from "@/app/components/ProductCard";
import ExpandOnHoverGallery from "@/app/components/ExpandOnHoverGallery";

async function getProducts() {
  try {
    const res = await fetch(`/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">Shop Our Collection</h1>

      <div className="mb-10">
        <ExpandOnHoverGallery
          items={[
            { title: "Men", img: "/homeMen.jpg", href: "/catalog/men" },
            { title: "Women", img: "/homeFemale.jpg", href: "/catalog/women" },
            { title: "Blue Light", img: "/homeBluelight.jpg", href: "/catalog/blue-light" },
          ]}
        />
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p: any) => (
            <ProductCard key={p._id} id={p._id} name={p.name} price={p.price} image={p.image || "/next.svg"} stock={p.stock} />
          ))}
        </div>
      )}
    </section>
  );
}
