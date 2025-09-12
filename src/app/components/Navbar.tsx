"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "@/hooks/use-cart";
import VirtualTryOnLogo from "./Logo";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Try-On", href: "/tryon" },
  { name: "About Us", href: "/about" },
  {
    name: "Categories",
    children: [
      { name: "Men", href: "/catalog/men" },
      { name: "Women", href: "/catalog/women" },
      { name: "Kids", href: "/catalog/kids" },
      { name: "Blue Light", href: "/catalog/blue-light" },
      { name: "Sunglasses", href: "/catalog/sunglasses" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
];

const languages = ["EN", "UR", "FR", "AR"];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200/70 shadow-sm">
      {/* 🔹 Top Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-pink-600 text-white text-xs sm:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-8">
          <div className="flex-1 flex justify-center gap-4 sm:gap-6 font-medium">
            <span>Delivery in 2–5 days</span>
            <span>Free shipping over $200</span>
          </div>

          {/* Language Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-medium hover:text-gray-200">
              {language} <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-28 bg-white border shadow-lg rounded-lg py-2 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <VirtualTryOnLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      activeDropdown === item.name
                        ? "text-pink-600"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {item.name} <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-56 bg-white/95 backdrop-blur border shadow-xl rounded-lg py-3"
                      >
                        <p className="px-4 pb-2 text-xs uppercase font-semibold text-gray-500 border-b">
                          Shop
                        </p>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-pink-600"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full"
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* 🔹 Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
{/* 🔹 Mobile Menu Panel */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 w-72 h-full bg-white shadow-2xl md:hidden z-50 flex flex-col"
    >
      {/* 🔹 Header (Logo + Close Button) */}
      <div className="flex  items-center justify-between border-b px-6 py-4">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="font-bold text-xl text-pink-600"
        >
          LensVision
        </Link>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-gray-600 hover:text-black transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* 🔹 Navigation (no scroll) */}
      <motion.nav
        className="flex-1 bg-white px-6 py-6 space-y-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.07 },
          },
        }}
      >
        {navigation.map((item) =>
          item.children ? (
            <motion.div
              key={item.name}
              variants={{
                hidden: { opacity: 0, x: 30 },
                show: { opacity: 1, x: 0 },
              }}
              className="space-y-2"
            >
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 hover:text-pink-600 transition">
                  {item.name}
                  <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-4 mt-2 space-y-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm rounded-md px-2 py-1 transition ${
                        pathname === child.href
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </details>
            </motion.div>
          ) : (
            <motion.div
              key={item.name}
              variants={{
                hidden: { opacity: 0, x: 30 },
                show: { opacity: 1, x: 0 },
              }}
            >
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium transition ${
                  pathname === item.href
                    ? "text-pink-600"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          )
        )}
      </motion.nav>

      {/* 🔹 Footer (Language + Contact) */}
      <div className="border-t bg-white px-6 py-4 space-y-3 text-sm text-gray-600">
        
        <p className="text-xs text-gray-500">
          © 2025 LensVision. All rights reserved.
        </p>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </header>
  );
}
