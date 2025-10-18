"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-600" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Your privacy matters. Learn how we collect, use, and safeguard your information.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 prose prose-invert:prose -mb-4">
        <div className="bg-card border rounded-2xl p-6 text-foreground">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground">We collect only the data necessary to provide and improve our services. We never sell your data.</p>

          <h3 className="mt-6 font-semibold">What we collect</h3>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Account details (name, email)</li>
            <li>Order and payment metadata</li>
            <li>Device and usage information</li>
          </ul>

          <h3 className="mt-6 font-semibold">Contact</h3>
          <p className="text-muted-foreground">For privacy requests, contact us at <Link href="/contact" className="underline">support@lensvision.com</Link>.</p>
        </div>
      </div>
    </div>
  );
}
