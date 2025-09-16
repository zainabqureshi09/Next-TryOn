import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Navbar";
import Providers from "./providers";
import { CartProvider } from "@/contexts/CartContext";

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
  metadataBase: new URL("https://lensvision.com"), // ✅ Fix for metadataBase warning
  openGraph: {
    title: "LensVision | AI-Powered Virtual Try-On",
    description:
      "Experience luxury eyewear with AI-powered virtual try-on. Shop sunglasses, contact lenses, and more with LensVision.",
    type: "website",
    url: "https://lensvision.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LensVision Virtual Try-On",
      },
    ],
  },
};

// ✅ Viewport config alag rakhna hai
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <CartProvider>
            {/* ✅ Header always on top */}
            <Header />

            {/* ✅ Main takes remaining space */}
            <main className="flex-grow">{children}</main>

            {/* ✅ Footer always at bottom */}
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
