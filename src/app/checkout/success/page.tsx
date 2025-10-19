"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/by-session/${sessionId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch order: ${res.status}`);
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchOrder();
    }
  }, [sessionId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
        <p className="mt-4 text-lg">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
        <p className="mt-2">We couldn&apos;t find your order details. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Thank you for your order!</h1>
          <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
          <p className="mt-1 text-sm text-gray-500">Order ID: #{order._id.substring(0, 8)}</p>

          <div className="mt-8 text-left divide-y divide-gray-200">
            {order.items.map((item: any) => (
              <div key={item.productId} className="py-4 flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
<p className="text-sm text-gray-500">Quantity: {item.qty ?? item.quantity}</p>
                </div>
<div className="font-medium">${(item.price * (item.qty ?? item.quantity ?? 1)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-gray-600">Subtotal: ${order.total.toFixed(2)}</p>
            <p className="text-gray-600">Shipping: $5.99</p>
            <p className="font-bold text-lg">Total: ${(order.total + 5.99).toFixed(2)}</p>
          </div>

          <div className="mt-8">
            <Link href="/shop" className="text-purple-700 hover:text-purple-900 font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

export default SuccessPage;
