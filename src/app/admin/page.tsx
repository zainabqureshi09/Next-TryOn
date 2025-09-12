import Link from "next/link";

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/stats`, { cache: "no-store" });
  if (!res.ok) return { productCount: 0, orderCount: 0, revenue: 0 };
  return res.json();
}

export default async function AdminHome() {
  const stats = await getStats();
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-600">Products</p>
          <p className="text-2xl font-bold">{stats.productCount}</p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-2xl font-bold">{stats.orderCount}</p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link href="/admin/products" className="text-purple-700 hover:underline">Manage Products</Link>
        </li>
        <li>
          <Link href="/admin/orders" className="text-purple-700 hover:underline">View Orders</Link>
        </li>
      </ul>
    </section>
  );
}
