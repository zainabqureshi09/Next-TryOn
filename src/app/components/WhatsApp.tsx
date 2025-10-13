"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923001234567" // replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center"
    >
      <FaWhatsapp
        size={54}
        className="text-[#16f066] drop-shadow-[0_0_10px_rgba(37,211,102,0.7)] hover:drop-shadow-[0_0_15px_rgba(37,211,102,1)] transition-all duration-300 animate-pulse"
      />
    </a>
  );
}