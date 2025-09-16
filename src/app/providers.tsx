"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}