"use client";

import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, addItem, decrement, removeItem, clear, subtotal } = useCart();
  const { t } = useTranslation();

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
        <h1 className="text-3xl font-bold mb-4">{t('cart.empty')}</h1>
        <p className="text-gray-600 mb-8">Find frames you love and try them on.</p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
        >
          {t('cart.goToShop')}
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">{t('cart.title')}</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border p-4 rounded-xl">
            {/* thumbnail */}
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.name} 
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg" 
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-purple-700 font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrement(item.id || item._id || '')}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                aria-label={`${t('cart.decrease')} ${item.name}`}
              >
                −
              </button>
              <span className="w-8 text-center">{item.qty}</span>
              <button
                onClick={() => addItem(item)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                aria-label={`${t('cart.increase')} ${item.name}`}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id || item._id || '')}
              className="px-3 py-1 text-sm text-red-600 hover:underline"
            >
              {t('cart.remove')}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={clear} className="text-sm text-gray-600 hover:underline">
          {t('cart.clear')}
        </button>
        <div className="text-right">
          <p className="text-lg">{t('cart.subtotal')}</p>
          <p className="text-2xl font-extrabold text-purple-800">
            ${subtotal().toFixed(2)}
          </p>
          <button
            onClick={checkout}
            className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </section>
  );
}
