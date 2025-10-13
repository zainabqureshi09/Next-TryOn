"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            expand
            closeButton
          />
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
