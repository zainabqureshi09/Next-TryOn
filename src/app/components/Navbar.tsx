"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import useCart from "@/hooks/use-cart";
import { useTranslation } from "@/hooks/use-translation";
import VirtualTryOnLogo from "./Logo";

type NavItem = {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const pathname = usePathname() || "/";
  const cartCount =
    (useCart((s) =>
      typeof s.count === "function" ? s.count() : s.count ?? 0
    ) ?? 0) as number;

  const { data: session, status } = useSession();
  const { t, currentLanguage, setLanguage } = useTranslation();

  const navigation: NavItem[] = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.tryon"), href: "/tryon" },
    { name: t("nav.about"), href: "/about" },
    {
      name: t("nav.categories"),
      children: [
        { name: t("nav.men"), href: "/catalog/men" },
        { name: t("nav.women"), href: "/catalog/women" },
        { name: t("nav.kids"), href: "/catalog/kids" },
        { name: t("nav.blueLight"), href: "/catalog/blue-light" },
        { name: t("nav.sunglasses"), href: "/catalog/sunglasses" },
      ],
    },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const languages = [
    { code: "EN", name: "English" },
    { code: "UR", name: "اردو" },
    { code: "FR", name: "Français" },
    { code: "AR", name: "العربية" },
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-pink-600 text-white text-xs sm:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-8">
          <div className="hidden sm:flex flex-1 justify-center gap-4 sm:gap-6 font-medium">
            <span>{t("topbar.delivery")}</span>
            <span>{t("topbar.freeShipping")}</span>
          </div>

          {/* Language Dropdown */}
          <div
            className="relative ml-auto"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              aria-haspopup="menu"
              aria-expanded={isLangOpen}
              className="flex items-center gap-1 text-xs font-medium hover:text-gray-200"
              type="button"
            >
              {String(currentLanguage).toUpperCase()} <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white border shadow-lg rounded-lg py-2 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${
                        String(currentLanguage).toUpperCase() === lang.code
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0" aria-label="LensVision home">
              <VirtualTryOnLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-4 lg:space-x-6"
              aria-label="Primary navigation"
            >
              {navigation.map((item) =>
                item.children ? (
                  <div
                    key={item.name}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      aria-haspopup="menu"
                      aria-expanded={activeDropdown === item.name}
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
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full mt-2 w-56 bg-white border shadow-xl rounded-lg py-3 z-50"
                        >
                          <p className="px-4 pb-2 text-xs uppercase font-semibold text-gray-500 border-b">
                            {t("nav.shop")}
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
                    href={item.href!}
                    className={`relative text-sm font-medium transition-colors flex-shrink-0 ${
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

            {/* Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Cart */}
              <Link href="/cart" className="relative" aria-label="Cart">
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
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-expanded={isMenuOpen}
                aria-label="Open mobile menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Fixed position with high z-index */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white shadow-2xl z-50 flex flex-col"
              aria-label="Mobile menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-semibold text-base text-pink-600"
                >
                  LensVision
                </Link>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-black transition"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation - Scrollable */}
              <motion.nav
                className="flex-1 bg-white px-6 py-6 space-y-6 overflow-y-auto"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {navigation.map((item) =>
                  item.children ? (
                    <motion.div
                      key={item.name}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
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
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={item.href!}
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

              {/* Footer */}
              <div className="border-t bg-white px-6 py-4 text-xs text-gray-500">
                © 2025 LensVision. All rights reserved.
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
