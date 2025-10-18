"use client";

import Link from "next/link";

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Returns & Refunds</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Shop with confidence. Learn how returns and refunds work at LensVision.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-card border rounded-2xl p-6 text-foreground">
          <h2 className="text-xl font-bold mb-4">Policy</h2>
          <p className="text-muted-foreground">You can return items within 30 days of delivery in original condition. Some exclusions may apply.</p>
          <h3 className="mt-6 font-semibold">How to request a return</h3>
          <ol className="list-decimal pl-6 text-muted-foreground">
            <li>Contact support with your order number</li>
            <li>Receive a return authorization</li>
            <li>Ship your item with the provided label</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
