async function getOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/orders`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

async function updateStatus(id: string, status: string) {
  "use server";
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const statuses = ["pending", "paid", "shipped", "cancelled"];
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Items</th>
              <th className="py-2 px-3">Subtotal</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o._id} className="border-t">
                <td className="py-2 px-3">{o.customerName}</td>
                <td className="py-2 px-3">{o.customerEmail}</td>
                <td className="py-2 px-3">{o.items?.length || 0}</td>
                <td className="py-2 px-3">${(o.subtotal || 0).toFixed(2)}</td>
                <td className="py-2 px-3">
                  <form action={async (formData) => {
                    "use server";
                    const status = String(formData.get("status"));
                    await updateStatus(o._id, status);
                  }}>
                    <select name="status" defaultValue={o.status} className="border rounded px-2 py-1">
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="ml-2 text-sm text-purple-700">Update</button>
                  </form>
                </td>
                <td className="py-2 px-3">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
