"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

const Skiper49 = () => {
  const images = [
    { src: "/images/x.com/13.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/32.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/20.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/21.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/19.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/1.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/2.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/3.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/4.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/5.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/6.jpeg", alt: "Illustrations by my fav AarzooAly" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f4f3] px-4">
      <Carousel_003 images={images} showPagination loop autoplay showNavigation />
    </div>
  );
};

export { Skiper49 };

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
    .Carousal_003 {
      width: 100%;
      height: 100%;
      padding-bottom: 40px !important;
    }
    
    .Carousal_003 .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 260px;
      max-width: 90vw;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .swiper-pagination-bullet {
      background-color: #000 !important;
    }
  `;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn("relative w-full max-w-5xl", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={showPagination ? { clickable: true } : false}
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="h-72 w-full object-cover md:h-96"
                src={image.src}
                alt={image.alt}
              />
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-7 w-7 text-black drop-shadow-lg" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-7 w-7 text-black drop-shadow-lg" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export { Carousel_003 };
