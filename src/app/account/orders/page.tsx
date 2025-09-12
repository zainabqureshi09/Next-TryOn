import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>Please sign in to view your orders.</p>
      </section>
    );
  }

  await dbConnect();
  const orders = await Order.find({ customerEmail: session.user.email }).sort({ createdAt: -1 }).lean();

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Items</th>
                <th className="py-2 px-3">Subtotal</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id} className="border-t">
                  <td className="py-2 px-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3">{o.items?.length || 0}</td>
                  <td className="py-2 px-3">${(o.subtotal || 0).toFixed(2)}</td>
                  <td className="py-2 px-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

