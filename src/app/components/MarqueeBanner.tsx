"use client";

import { FC } from "react";
import { BsSunglasses } from "react-icons/bs";
import { Gi3dGlasses } from "react-icons/gi";
import { IoGlassesOutline } from "react-icons/io5";

interface MarqueeMessage {
  text: string;
  color: string;
  Icon?: FC<any>; // optional icon
}

const messages: MarqueeMessage[] = [
  { text: "Pay with bank transfer and get", color: "text-purple-600", Icon: Gi3dGlasses },
  { text: "Flat 15% discount on glasses & sunglasses", color: "text-white", Icon: BsSunglasses },
  { text: "At checkout!", color: "text-sky-400" },
  { text: "10% discount on contact lenses", color: "text-pink-500", Icon: IoGlassesOutline },
];

const MarqueeBanner: FC = () => {
  return (
    <section
      aria-label="Special Offers"
      itemScope
      itemType="https://schema.org/Offer"
      className="overflow-hidden py-3 shadow-inner"
      style={{ background: "linear-gradient(90deg, #301934, #111111, #4c1d95, #9333ea, #301934)" }}
    >
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {messages.concat(messages).map((msg, idx) => (
          <div
            key={idx}
            itemProp="description"
            className={`flex items-center gap-2 font-bold text-lg md:text-xl lg:text-2xl ${msg.color} transition-transform duration-300 hover:scale-105`}
          >
            {msg.Icon && <msg.Icon size={28} />}
            {msg.text}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default MarqueeBanner;
