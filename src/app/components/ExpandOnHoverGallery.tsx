"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export type GalleryItem = {
  title: string;
  img: string;
  href?: string;
};

export default function ExpandOnHoverGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="group relative mx-auto flex w-full max-w-6xl gap-4 overflow-hidden"
      onMouseLeave={() => setActive(null)}
    >
      {items.map((it, idx) => {
        const isActive = active === idx;
        const basis = isActive ? "basis-2/3" : active === null ? "basis-1/3" : "basis-1/6";
        const content = (
          <div
            className={`${basis} relative h-80 overflow-hidden rounded-2xl border border-purple-200 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
            onMouseEnter={() => setActive(idx)}
          >
            <Image
              src={it.img}
              alt={it.title}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover transition-transform duration-500 ${
                isActive ? "scale-110" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-xl font-semibold drop-shadow">{it.title}</h3>
            </div>
          </div>
        );
        return it.href ? (
          <Link key={it.title} href={it.href} className="block flex-1 min-w-0">
            {content}
          </Link>
        ) : (
          <div key={it.title} className="flex-1 min-w-0">
            {content}
          </div>
        );
      })}
    </div>
  );
}







