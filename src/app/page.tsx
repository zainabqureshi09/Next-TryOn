"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Camera,
  ShoppingBag,
  Shield,
  Truck,
  Clock,
  ArrowRight,
  Search,
  Gift,
  Crown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { HeroMarquee } from "@/app/components/Hero";
import MarqueeBanner from "./components/MarqueeBanner";

const featuredProducts = [
  {
    id: "1",
    name: "LensVision Classic Aviator",
    price: 129.99,
    originalPrice: 159.99,
    description: "Timeless aviator frames with UV protection and premium materials.",
    image: "/assets/frame1.jpg",
    rating: 4.8,
    reviewCount: 156,
    category: "sunglasses",
    brand: "LensVision",
    inStock: true,
    isOnSale: true,
    freeShipping: true,
  },
  {
    id: "2",
    name: "LensVision Modern Rectangle",
    price: 89.99,
    description: "Sleek rectangular frames perfect for professional settings.",
    image: "/assets/homeMen.jpg",
    rating: 4.6,
    reviewCount: 89,
    category: "men",
    brand: "LensVision",
    inStock: true,
    isNew: true,
    freeShipping: true,
  },
  {
    id: "3",
    name: "LensVision Elegant Cat Eye",
    price: 199.99,
    originalPrice: 249.99,
    description: "Sophisticated cat eye frames with vintage charm.",
    image: "/assets/female.jpg",
    rating: 4.9,
    reviewCount: 234,
    category: "women",
    brand: "LensVision",
    inStock: true,
    isOnSale: true,
    freeShipping: true,
  },
  {
    id: "4",
    name: "LensVision Vintage Round",
    price: 299.99,
    description: "Vintage-inspired round frames with modern technology.",
    image: "/assets/frame1.jpg",
    rating: 4.7,
    reviewCount: 112,
    category: "sunglasses",
    brand: "LensVision",
    inStock: true,
    isNew: true,
    freeShipping: true,
  },
];

const categories = [
  {
    name: "Men's Collection",
    count: "350+ styles",
    image: "/assets/homeMen.jpg",
    href: "/shop?category=men",
    discount: "Up to 40% Off",
  },
  {
    name: "Women's Collection",
    count: "450+ styles",
    image: "/assets/female.jpg",
    href: "/shop?category=women",
    discount: "Up to 35% Off",
  },
  {
    name: "Luxury Sunglasses",
    count: "280+ styles",
    image: "/assets/slideHome.jpg",
    href: "/shop?category=sunglasses",
    discount: "Up to 50% Off",
  },
];

const features = [
  {
    icon: Camera,
    title: "AI Virtual Try-On",
    description:
      "Experience next-generation realism — preview your perfect look in real time.",
    badge: "New",
  },
  {
    icon: Truck,
    title: "Free Global Shipping",
    description:
      "Complimentary express delivery worldwide — beautifully packaged.",
    badge: "Complimentary",
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description:
      "Every LensVision piece is crafted to last a lifetime — and backed by it.",
    badge: "Guaranteed",
  },
  {
    icon: Clock,
    title: "60-Day Returns",
    description: "Luxury should be effortless. Enjoy stress-free returns.",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#faf8ff] to-[#fefbff] text-gray-900 font-[Inter]">
      {/* 🎯 Luxury Banner */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#2a0052] via-[#4c007d] to-[#7500a6] text-gray-100 py-3 text-center relative shadow-lg"
        >
          <p className="text-sm tracking-wide font-medium">
            ✨ <strong>Luxury Event:</strong> Enjoy up to 40% off + Complimentary Global Shipping
          </p>
          <button
            aria-label="Close banner"
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 🪞 Hero */}
      <HeroMarquee />
      <MarqueeBanner />

      {/* 🔍 Search */}
      <section className="py-12 sm:py-16 bg-white/40 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search handcrafted eyewear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 sm:py-4 bg-white/70 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-[#6b00b3] focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>
        </div>
      </section>

      {/* 🕶️ Categories */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Discover Our Collections
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Tailored elegance — explore the perfect eyewear to express your signature style.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  href={cat.href}
                  className="group relative rounded-xl sm:rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-700"
                >
                  <div className="relative aspect-[4/3] sm:aspect-[4/3]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-200 mb-2">{cat.count}</p>
                    <Badge className="bg-gradient-to-r from-[#f6d365] to-[#fda085] text-black text-xs mt-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg font-semibold tracking-wide">
                      {cat.discount}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ Best Sellers */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">Our best Products</h2>
              <p className="text-base sm:text-lg text-gray-600">
                Timeless craftsmanship, modern sophistication.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white transition-all w-full sm:w-auto"
              asChild
            >
              <Link href="/shop">
                View All <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ProductCard product={p} layout="grid" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💼 Features */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,100,255,0.05),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Why LensVision?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Designed for the discerning. Every detail, perfected.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="relative text-center p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/60 backdrop-blur-lg hover:-translate-y-1 sm:hover:-translate-y-2">
                    {feature.badge && (
                      <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full">
                        {feature.badge}
                      </Badge>
                    )}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✨ Final CTA */}
      <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-r from-[#2a0052] via-[#5b0095] to-[#8800d4] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-10 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
          <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Redefine Luxury. Refine Your Vision.
          </h2>
          <p className="text-base sm:text-lg text-purple-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Discover the harmony of technology and artistry in every frame.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-lg sm:max-w-none mx-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-full hover:scale-105 transition-all shadow-xl w-full sm:w-auto"
              asChild
            >
              <Link href="/tryon">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Try-On Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-full bg-purple-900 hover:bg-white hover:text-purple-900 transition-all shadow-xl w-full sm:w-auto"
              asChild
            >
              <Link href="/shop">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Explore Collection
              </Link>
            </Button>
          </div>
          <p className="text-purple-200 text-sm mt-8 sm:mt-10">
            <Gift className="w-4 h-4 inline mr-2" />
            <strong>Exclusive Offer:</strong> Complimentary global shipping + 30-day returns.
          </p>
        </div>
      </section>
    </div>
  );
}
