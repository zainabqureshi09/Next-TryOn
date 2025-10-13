"use client";

import { useState } from "react";
import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import Link from "next/link";
import Image from "next/image";

/**
 * 🛒 Cart Page (Next.js 14 + App Router)
 * - Fixes undefined errors and edge cases
 * - Improved subtotal logic and UX
 * - Clean async checkout flow with robust error handling
 */

export default function CartPage() {
  const {
    items = [],
    updateItem,
    addItem,
    decrement,
    removeItem,
    clear,
    subtotal,
    isLoading: cartLoading,
    error: cartError,
  } = useCart();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>(cartError || "");

  // 🧾 Checkout Handler
  const checkout = async () => {
    if (!items?.length) {
      alert(t("cart.emptyError" as any) || "Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // ✅ Format items with proper fallbacks
      const formattedItems = items.map((item) => ({
        id: item.id || item._id || "",
        _id: item._id || item.id || "",
        name: item.name || "Product",
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1,
        image: item.image || null,
        frame: (item as any).frame || "",
      }));

      // ✅ Validate items
      const invalid = formattedItems.some(
        (it) => (!it.id && !it._id) || isNaN(it.price) || it.qty <= 0
      );
      if (invalid) {
        throw new Error(
          "Some items in your cart have invalid data. Please refresh or contact support."
        );
      }

      // ✅ Send to checkout API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: formattedItems,
          customerEmail: "guest@example.com",
        }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          typeof responseData?.error === "string"
            ? responseData.error
            : responseData?.details ||
              responseData?.error?.message ||
              "Checkout failed.";
        throw new Error(message);
      }

      if (!responseData?.url) {
        throw new Error("Missing checkout URL in server response.");
      }

      // ✅ Redirect to Stripe Checkout
      window.location.href = responseData.url;
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An unexpected error occurred during checkout.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🧺 Empty Cart State
  if (!items || items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16 text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">
          {t("cart.empty" as any) || "Your cart is empty"}
        </h1>
        <p className="text-gray-600 mb-8">
          {t("cart.emptyMessage" as any) || "Find frames you love and try them on."}
        </p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all shadow-sm"
        >
          {t("cart.goToShop" as any) || "Go to Shop"}
        </Link>
      </section>
    );
  }

  // Calculate safe subtotal
  const calculatedSubtotal = subtotal ? subtotal() : 0;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 animate-fadeIn">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        {t("cart.title" as any) || "Your Shopping Cart"}
      </h1>

      <div className="space-y-6">
        {items.map((item) => {
          const itemId = item.id || item._id || "";
          const itemName = item.name || "Unnamed Product";
          const itemPrice = Number(item.price) || 0;
          const itemQty = Number(item.qty) || 1;

          return (
            <div
              key={itemId}
              className="flex items-center gap-4 border p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              {/* 🖼️ Thumbnail */}
              {item.image ? (
                <Image
                  src={item.image}
                  alt={itemName}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              {/* 🧾 Details */}
              <div className="flex-1">
                <p className="font-semibold">{itemName}</p>
                <p className="text-purple-700 font-bold">
                  ${itemPrice.toFixed(2)}
                </p>
              </div>

              {/* 🔢 Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(itemId)}
                  disabled={loading || cartLoading}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  aria-label={`${t("cart.decrease" as any) || "Decrease"} ${itemName}`}
                >
                  −
                </button>
                <span className="w-8 text-center">{itemQty}</span>
                <button
                  onClick={() => addItem(item)}
                  disabled={loading || cartLoading}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  aria-label={`${t("cart.increase" as any) || "Increase"} ${itemName}`}
                >
                  +
                </button>
              </div>

              {/* ❌ Remove */}
              <button
                onClick={() => removeItem(itemId)}
                disabled={loading || cartLoading}
                className="px-3 py-1 text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                {t("cart.remove" as any) || "Remove"}
              </button>
            </div>
          );
        })}
      </div>

      {/* 🧮 Footer */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4">
        <button
          onClick={clear}
          disabled={loading || cartLoading || items.length === 0}
          className="text-sm text-gray-600 hover:underline disabled:opacity-50"
        >
          {t("cart.clear" as any) || "Clear Cart"}
        </button>

        <div className="text-right">
          <p className="text-lg text-gray-700">
            {t("cart.subtotal" as any) || "Subtotal"}
          </p>
          <p className="text-2xl font-extrabold text-purple-800">
            ${calculatedSubtotal.toFixed(2)}
          </p>

          <button
            onClick={checkout}
            disabled={loading || cartLoading || items.length === 0}
            className={`mt-4 px-6 py-3 rounded-lg text-white font-semibold shadow-sm transition-all ${
              loading || cartLoading || items.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading
              ? t("cart.processing" as any) || "Processing..."
              : t("cart.checkout" as any) || "Proceed to Checkout"}
          </button>

          {errorMsg && (
            <p className="text-sm text-red-600 mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}