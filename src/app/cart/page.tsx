"use client";

import useCart from "@/hooks/use-cart";
import Link from "next/link";

export default function CartPage() {
  const { items, addItem, decrement, removeItem, clear, subtotal } = useCart();

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customerEmail: "guest@example.com" }),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert(data?.error || "Unable to start checkout");
    }
  };

  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Find frames you love and try them on.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
        >
          Go to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border p-4 rounded-xl">
            {/* thumbnail */}
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-purple-700 font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrement(item.id)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>
              <span className="w-8 text-center">{item.qty}</span>
              <button
                onClick={() => addItem(item)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={clear} className="text-sm text-gray-600 hover:underline">
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-lg">Subtotal</p>
          <p className="text-2xl font-extrabold text-purple-800">
            ${subtotal().toFixed(2)}
          </p>
          <button
            onClick={checkout}
            className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
