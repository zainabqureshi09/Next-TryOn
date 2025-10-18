import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import dynamic from "next/dynamic";
import { CartProvider } from "@/contexts/CartContext";
import Providers from "@/app/providers";
import Header from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dynamically import non-critical components
const WhatsAppButton = dynamic(() => import("./components/WhatsApp"), {
  loading: () => null,
});
const ScrollToTopButton = dynamic(() => import("./components/Scroller"), {
  loading: () => null,
});


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LensVision | AI-Powered Virtual Try-On",
  description:
    "Experience luxury eyewear with AI-powered virtual try-on. Shop sunglasses, contact lenses, and more with LensVision.",
  keywords: [
    "eyewear",
    "virtual try-on",
    "sunglasses",
    "luxury glasses",
    "AI eyewear",
  ],
  authors: [{ name: "LensVision", url: "https://lensvision.com" }],
  metadataBase: new URL("https://lensvision.com"),
  openGraph: {
    title: "LensVision | AI-Powered Virtual Try-On",
    description:
      "Experience luxury eyewear with AI-powered virtual try-on. Shop sunglasses, contact lenses, and more with LensVision.",
    type: "website",
    url: "https://lensvision.com",
    images: [
      {
        url: "/assets/slideHome.jpg",
        width: 1200,
        height: 630,
        alt: "LensVision Virtual Try-On",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-br from-background to-background/95 text-foreground antialiased flex flex-col min-h-screen`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-primary text-primary-foreground px-3 py-2 rounded-md">Skip to content</a>
        <Providers>
          <CartProvider>
            <ErrorBoundary>
              <Header />
              <main id="main-content" className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppButton />
              <ScrollToTopButton />
            </ErrorBoundary>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
