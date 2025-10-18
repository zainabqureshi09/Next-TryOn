"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Understand the terms that govern your use of LensVision services.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-card border rounded-2xl p-6 text-foreground">
          <h2 className="text-xl font-bold mb-4">Agreement</h2>
          <p className="text-muted-foreground">By using our website, you agree to these terms. Please read them carefully.</p>
          <h3 className="mt-6 font-semibold">Orders & Payments</h3>
          <p className="text-muted-foreground">All orders are subject to acceptance and availability. Payments are processed securely.</p>
        </div>
      </div>
    </div>
  );
}
