"use client";

import Link from "next/link";

type CardItem = { label: string; href: string };

const defaultCards: CardItem[] = [
  { label: "Shop Men", href: "/catalog/men" },
  { label: "Shop Women", href: "/catalog/women" },
  { label: "Blue Light", href: "/catalog/blue-light" },
  { label: "Sunglasses", href: "/catalog/sunglasses" },
];

const defaultMarquee = [
  "Premium Materials",
  "AI Virtual Try-On",
  "Fast Delivery",
  "Easy Returns",
];

function repeat<T>(arr: T[], times: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < times; i++) out.push(...arr);
  return out;
}

function Skiper40({
  cards = defaultCards,
  marqueeItems = defaultMarquee,
  marqueeSpeedSec = 18,
}: {
  cards?: CardItem[];
  marqueeItems?: string[];
  marqueeSpeedSec?: number;
}) {
  const repeated = repeat(marqueeItems, 4);
  return (
    <section className="w-full">
      {/* Expand On Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-2xl border border-purple-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
          >
            <div className="flex h-28 items-center justify-center text-lg font-semibold text-purple-900">
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Text Scroll (Marquee) */}
      <div className="relative mt-10 overflow-x-hidden border-y border-purple-200 py-3">
        <div
          className="flex whitespace-nowrap animate-marquee"
          style={{ 
            animationDuration: `${marqueeSpeedSec}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        >
          {repeated.map((text, idx) => (
            <span key={`${text}-${idx}`} className="mx-6 text-sm font-medium text-purple-800">
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Skiper40 };
