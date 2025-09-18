"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui";
import { useTranslation } from "@/hooks/use-translation"; // fixed import

interface ColorwayOption {
  id: string;
  name: string;
  hero: string;
  accent: string;
  type: "image" | "video";
}

const colorways: ColorwayOption[] = [
  {
    id: "classic-black",
    name: "Classic Black",
    hero: "/assets/hero-aviator.mp4",
    accent: "#000000",
    type: "video",
  },
];

export function HeroMarquee() {
  const { t } = useTranslation(); // hook use
  const { activeColorway } = useUIStore();
  const currentColorway =
    colorways.find((c) => c.id === activeColorway) || colorways[0];

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-black">
      {/* Background */}
      {currentColorway.type === "video" ? (
        <motion.div
          key={currentColorway.id}
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={currentColorway.hero} type="video/mp4" />
          </video>
        </motion.div>
      ) : (
        <motion.div
          key={currentColorway.id}
          className="absolute inset-0 z-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${currentColorway.hero})`,
          }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      )}

      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl text-left text-white"
        >
          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {t("hero.title")}
            <span className="block text-3xl md:text-4xl font-light text-gray-200 mt-2">
              {t("hero.subtitle")}
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-lg md:text-xl mb-10 text-gray-300 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button className="w-full sm:w-auto bg-purple-950/70 backdrop-blur-md text-white font-semibold border border-white/20 rounded-full px-8 py-4 hover:bg-transparent hover:text-white transition-colors duration-300">
                {t("hero.shopNow")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="w-full sm:w-auto bg-white/10 text-white font-light border border-white/30 rounded-full px-8 py-4 hover:bg-pink-600/80 hover:text-white transition-colors duration-300">
                {t("hero.contactUs")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
