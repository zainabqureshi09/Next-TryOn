"use client";

import { useMemo, useState } from "react";
import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import Link from "next/link";
import Image from "next/image";

type CartItem = {
  id?: string;
  _id?: string;
  name?: string;
  price?: number | string;
  qty?: number | string;
  image?: string | null;
  frame?: string;
  [k: string]: any;
};

type UseCartReturn = {
  items?: CartItem[];
  updateItem?: (id: string, payload: Partial<CartItem>) => void;
  addItem?: (item: CartItem) => void;
  decrement?: (id: string) => void;
  removeItem?: (id: string) => void;
  clear?: () => void;
  subtotal?: number | (() => number);
  isLoading?: boolean;
  error?: string | null;
};

export default function CartPage() {
  // Cast to a typed shape but keep safe fallbacks
  const rawCart = (useCart() as unknown as UseCartReturn) || {};
  const {
    items = [],
    updateItem,
    addItem,
    decrement,
    removeItem,
    clear,
    subtotal,
    isLoading: cartLoading = false,
    error: cartError,
  } = rawCart;

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>(cartError || "");

  // Safe helper - get numeric price & qty
  const normalizeItem = (item: CartItem) => ({
    ...item,
    id: item.id || item._id || "",
    _id: item._id || item.id || "",
    name: item.name || "Product",
    price: Number(item.price ?? 0) || 0,
    qty: Math.max(1, Number(item.qty ?? 1) || 1),
    image: item.image ?? null,
    frame: item.frame ?? "",
  });

  // Safe subtotal: supports number or function
  const calculatedSubtotal = useMemo(() => {
    if (typeof subtotal === "number") return subtotal;
    if (typeof subtotal === "function") {
      try {
        const s = subtotal();
        return typeof s === "number" && !Number.isNaN(s) ? s : 0;
      } catch {
        return 0;
      }
    }
    // fallback compute from items (in case hook lacks subtotal)
    return items.reduce((acc, it) => {
      const n = normalizeItem(it);
      return acc + n.price * n.qty;
    }, 0);
  }, [subtotal, items]);

  // Checkout handler
  const checkout = async () => {
    if (!items || items.length === 0) {
      // fallback to a friendly UI alert
      alert((t("cart.emptyError" as any) as string) || "Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const formattedItems = items.map(normalizeItem);

      const invalid = formattedItems.some(
        (it) => (!it.id && !it._id) || Number.isNaN(it.price) || it.qty <= 0
      );
      if (invalid) {
        throw new Error(
          "Some items in your cart have invalid data. Please refresh or contact support."
        );
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: formattedItems,
          customerEmail: "guest@example.com",
        }),
      });

      let responseData: any = {};
      try {
        responseData = await res.json();
      } catch {
        responseData = {};
      }

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

      // redirect to checkout (Stripe or other)
      window.location.href = responseData.url;
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Empty cart UI
  if (!items || items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16 text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">
          {t("cart.empty" as any) || "Your cart is empty"}
        </h1>
        <p className="text-gray-600 mb-8">
          {t("cart.emptyMessage" as any) ||
            "Find frames you love and try them on."}
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

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 animate-fadeIn">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        {t("cart.title" as any) || "Your Shopping Cart"}
      </h1>

      <div className="space-y-6">
        {items.map((rawItem, index) => {
          const item = normalizeItem(rawItem);
          const key = item.id || item._id || `cart-item-${index}`;

          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              {item.image ? (
                // Next Image requires a valid src — if remote domains are used,
                // ensure they are in next.config.js images.domains
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              {/* Details */}
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-purple-700 font-bold">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => (decrement ? decrement(item.id || item._id || "") : undefined)}
                  disabled={loading || cartLoading}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  aria-label={`${t("cart.decrease" as any) || "Decrease"} ${
                    item.name
                  }`}
                >
                  −
                </button>

                <span className="w-8 text-center">{item.qty}</span>

                <button
                  onClick={() => (addItem ? addItem(rawItem) : undefined)}
                  disabled={loading || cartLoading}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  aria-label={`${t("cart.increase" as any) || "Increase"} ${
                    item.name
                  }`}
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => (removeItem ? removeItem(item.id || item._id || "") : undefined)}
                disabled={loading || cartLoading}
                className="px-3 py-1 text-sm text-red-600 hover:underline disabled:opacity-50 mt-2 sm:mt-0 self-start sm:self-auto"
              >
                {t("cart.remove" as any) || "Remove"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4">
        <button
          onClick={() => (clear ? clear() : undefined)}
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
              ? (t("cart.processing" as any) as string) || "Processing..."
              : (t("cart.checkout" as any) as string) || "Proceed to Checkout"}
          </button>

          {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}
        </div>
      </div>
    </section>
  );
}
