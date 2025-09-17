"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroMarquee } from "./components/Hero";
import MarqueeBanner from "./components/MarqueeBanner";
import AnimatedSection from "./components/AnimatedSection";
import { motion } from "framer-motion";
import { Carousel_003 } from "@/components/v1/skiper49";
import Image from "next/image";
import useTranslation from "@/hooks/use-translation";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const addSectionRef = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    sectionsRef.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });

    if (parallaxRef.current) {
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -10, scale: 1 },
        {
          yPercent: 10,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  const collections = [
    { title: "Men", img: "/assets/homeMen.jpg", href: "/catalog/men" },
    { title: "Women", img: "/assets/female.jpg", href: "/catalog/women" },
    { title: "Blue Light", img: "/assets/bluelight.jpg", href: "/catalog/blue-light" },
  ];

  return (
    <>
      {/* SEO HEAD */}
      <Head>
        <title>LensVision – Premium Eyewear with AI Virtual Try-On</title>
        <meta
          name="description"
          content="Shop luxury eyewear with AI-powered virtual try-on. Discover men's, women's, and blue light collections at LensVision."
        />
        <meta
          name="keywords"
          content="eyewear, glasses, sunglasses, blue light, AI try-on, LensVision"
        />
        <meta name="author" content="LensVision" />
      </Head>

      <div className="w-full bg-white text-black font-sans">
        {/* Hero Section */}
        <HeroMarquee />
        <MarqueeBanner />

        {/* Categories Carousel */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold my-12 
                     bg-gradient-to-r from-purple-950 via-purple-800 to-purple-900 
                     bg-clip-text text-transparent tracking-tight 
                     font-serif drop-shadow-lg text-center"
        >
          {t('home.exploreCollection')}
        </motion.h2>

        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="w-full max-w-5xl overflow-hidden">
            <Carousel_003
              images={[
                { src: "/assets/frame1.jpg", alt: "Men Collection" },
                { src: "/assets/slideHome.jpg", alt: "Women Collection" },
                { src: "/assets/slide2home.jpg", alt: "Blue Light" },
              ]}
              showPagination
              showNavigation
              spaceBetween={30}
            />
          </div>
        </div>

        {/* Product Collection Showcase */}
        <AnimatedSection>
          <section
            ref={addSectionRef}
            className="py-16 sm:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-purple-100"
          >
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-10 sm:mb-12
                           bg-gradient-to-r from-purple-950 via-purple-800 to-purple-900 
                           bg-clip-text text-transparent tracking-tight 
                           font-serif drop-shadow-lg text-center"
              >
                {t('home.signatureCollections')}
              </motion.h2>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
                {collections.map((item, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <Link href={item.href}>
                      <div className="relative w-full h-64 sm:h-72 lg:h-80">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover transform group-hover:scale-110 transition duration-500"
                          sizes="(max-width: 640px) 100vw, 
                                 (max-width: 1024px) 50vw, 
                                 33vw"
                          priority={i === 0}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection>
          <section
            ref={addSectionRef}
            className="py-20 sm:py-28 bg-gray-50 text-center relative z-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-10 sm:mb-12
                         bg-gradient-to-r from-purple-950 via-purple-800 to-purple-900 
                         bg-clip-text text-transparent tracking-tight 
                         font-serif drop-shadow-lg text-center"
            >
              {t('home.whyChooseUs')}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 container mx-auto px-6">
              {[
                {
                  title: t('home.premiumQuality'),
                  desc: t('home.premiumQualityDesc'),
                },
                {
                  title: t('home.smartTechnology'),
                  desc: t('home.smartTechnologyDesc'),
                },
                {
                  title: t('home.luxuryDesign'),
                  desc: t('home.luxuryDesignDesc'),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-white rounded-2xl border border-purple-200 shadow-md hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 font-display">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Parallax Philosophy */}
        <section
          ref={addSectionRef}
          className="relative h-[80vh] sm:h-screen flex items-center justify-center overflow-hidden"
        >
          <div
            ref={parallaxRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: "url(/assets/homeCen.jpg)" }}
          >
            <div className="absolute inset-0 bg-purple-900/80" />
          </div>

          <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-6 text-purple-200 drop-shadow-xl tracking-tight font-display">
              {t('home.redefiningEyewear')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 leading-relaxed font-sans font-light">
              {t('home.redefiningDesc')}
            </p>
          </div>
        </section>

        {/* CTA */}
        <AnimatedSection>
          <section
            ref={addSectionRef}
            className="py-20 sm:py-28 text-center bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-100 relative z-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-6 text-purple-900 tracking-tight font-display">
              {t('home.experienceTryOn')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-sans font-medium">
              {t('home.experienceDesc')}
            </p>
            <Link href="/tryon">
              <Button className="px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg rounded-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:scale-110 transition-transform shadow-xl text-white font-semibold font-sans">
                {t('home.startTryOn')} <ArrowRight className="ml-2 w-5 sm:w-6 h-5 sm:h-6" />
              </Button>
            </Link>
          </section>
        </AnimatedSection>
      </div>
    </>
  );
}

