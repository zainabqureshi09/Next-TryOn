import Link from "next/link";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg"
        >
          New Product
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p._id} className="border-t">
                <td className="py-2 px-3">{p.name}</td>
                <td className="py-2 px-3">
                  ${Number(p.price).toFixed(2)}
                </td>
                <td className="py-2 px-3">{p.stock ?? 0}</td>
                <td className="py-2 px-3">
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="text-purple-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}




