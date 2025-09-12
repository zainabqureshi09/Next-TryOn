"use client";

import { PropsWithChildren } from "react";
import { useReveal } from "@/lib/utils";

export default function AnimatedSection({ children, className }: PropsWithChildren<{ className?: string }>) {
  const ref = useReveal({ y: 60, once: false });
  return (
    <section ref={ref as any} className={className}>
      {children}
    </section>
  );
}

