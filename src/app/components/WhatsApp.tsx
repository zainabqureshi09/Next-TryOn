"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // WhatsApp style icon
import { FaWhatsapp} from "react-icons/fa";

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  // Scroll detect karna
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <a
          href="https://wa.me/923001234567" // yahan apna WhatsApp number dalna
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          <FaWhatsapp className="w-7 h-7" />
          {/* Tooltip */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-white bg-black/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
