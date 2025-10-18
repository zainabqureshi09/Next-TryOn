"use client";

import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Shipping Information</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Fast, reliable shipping. Learn about timelines, costs, and tracking.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-card border rounded-2xl p-6 text-foreground">
          <h2 className="text-xl font-bold mb-4">Delivery</h2>
          <p className="text-muted-foreground">Orders are processed within 1-2 business days. Free express shipping on eligible orders.</p>
          <h3 className="mt-6 font-semibold">Tracking</h3>
          <p className="text-muted-foreground">You will receive a tracking link by email once your order ships.</p>
        </div>
      </div>
    </div>
  );
}
