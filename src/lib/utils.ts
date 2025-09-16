'use client'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// ✅ Register GSAP plugin once (safe for Next.js)
if (typeof window !== "undefined" && gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ✅ Utility function for conditional Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Custom hook for reveal animation
export function useReveal(options?: { y?: number; duration?: number; once?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options?.y ?? 40 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: options?.once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options?.y, options?.duration, options?.once]);

  return ref;
}
