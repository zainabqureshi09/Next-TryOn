import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Header from './components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LensVision | AI-Powered Virtual Try-On',
  description:
    'Experience luxury eyewear with AI-powered virtual try-on. Shop sunglasses, contact lenses, and more with LensVision.',
  keywords: ['eyewear', 'virtual try-on', 'sunglasses', 'luxury glasses', 'AI eyewear'],
  authors: [{ name: 'LensVision', url: 'https://lensvision.com' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'LensVision | AI-Powered Virtual Try-On',
    description:
      'Experience luxury eyewear with AI-powered virtual try-on. Shop sunglasses, contact lenses, and more with LensVision.',
    type: 'website',
    url: 'https://lensvision.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LensVision Virtual Try-On',
      },
    ],
  },
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
          {/* Header */}
          <Header />
          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
