"use client";

import { useState } from "react";
import Image from "next/image";
import useTranslation from "@/hooks/use-translation";
import VirtualTryOn from "../../components/VirtualTryOn";

export default function TryonPage() {
  const { t } = useTranslation();
  const [useCamera, setUseCamera] = useState(true);
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState(2.0);
  const [verticalOffset, setVerticalOffset] = useState(-40);

  // Example frame overlays (ensure files exist in public/assets/products/)
  const frames = [
    { id: "aviator", name: "Aviator", overlay: "/assets/products/sunglasses1.png" },
    { id: "bluelight", name: "Blue Light", overlay: "/assets/products/bluelight1.png" },
    { id: "round", name: "Round", overlay: "/assets/products/round1.png" },
    { id: "classic", name: "Classic", overlay: "/assets/products/classic1.png" },
  ];

  const [selected, setSelected] = useState(frames[0]);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">{t('tryon.title')}</h1>
      <p className="text-gray-600 mb-6">
        {t('tryon.subtitle')}
      </p>

      {/* Frame Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {frames.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(f)}
            className={`border rounded-xl p-3 text-sm transition-colors duration-300 ${
              selected.id === f.id
                ? "border-purple-700 shadow-lg"
                : "border-gray-200 hover:border-purple-400"
            }`}
          >
            {/* ✅ Use Next.js public images */}
            <Image
              src={f.overlay}
              alt={f.name}
              width={100}
              height={96}
              className="w-full h-24 object-contain mb-2"
            />
            {f.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => {
            setUseCamera(true);
            setUserImageSrc(null);
          }}
          className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
            useCamera
              ? "bg-purple-700 text-white"
              : "border-purple-700 text-purple-700 hover:bg-purple-50"
          }`}
        >
          {t('tryon.useWebcam')}
        </button>
        <button
          onClick={() => {
            setUseCamera(false);
            // 👇 check karo file public/uploads/sample-user.jpg me exist karti hai
            setUserImageSrc("/uploads/sample-user.jpg");
          }}
          className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
            !useCamera
              ? "bg-purple-700 text-white"
              : "border-purple-700 text-purple-700 hover:bg-purple-50"
          }`}
        >
          {t('tryon.uploadPhoto')}
        </button>

        {/* Sliders */}
        <label className="ml-4 text-sm font-medium">{t('tryon.scale')}</label>
        <input
          type="range"
          min={1.6}
          max={3.2}
          step={0.1}
          value={scaleFactor}
          onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
        />

        <label className="ml-4 text-sm font-medium">{t('tryon.verticalOffset')}</label>
        <input
          type="range"
          min={-80}
          max={40}
          step={2}
          value={verticalOffset}
          onChange={(e) => setVerticalOffset(parseFloat(e.target.value))}
        />
      </div>

      {/* TryOn Preview */}
      <VirtualTryOn
        productImage={selected.overlay}
        useCamera={useCamera}
        userImageSrc={userImageSrc}
        scaleFactor={scaleFactor}
        verticalOffset={verticalOffset}
      />
    </section>
  );
}
