"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VirtualTryOn from "@/app/components/VirtualTryon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const frames = [
  { id: "aviator", name: "Aviator", overlay: "/assets/products/sunglasses1.png" },
  { id: "bluelight", name: "Blue Light", overlay: "/assets/products/bluelight1.png" },
  { id: "round", name: "Round", overlay: "/assets/products/round1.png" },
  { id: "classic", name: "Classic", overlay: "/assets/products/classic1.png" },
];

export default function TryonPage() {
  const params = useSearchParams();
  const overlayParam = params.get("overlay");

  // pick frame from URL or default
  const defaultFrame = useMemo(
    () => frames.find((f) => f.id === overlayParam) || frames[0],
    [overlayParam]
  );

  const [selected, setSelected] = useState(defaultFrame);
  const [useCamera, setUseCamera] = useState(true);
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState(2.4);
  const [vOffset, setVOffset] = useState<number>(-40);

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasHolderRef = useRef<HTMLDivElement>(null);

  // sync with URL param
  useEffect(() => {
    setSelected(defaultFrame);
  }, [defaultFrame]);

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImageSrc(String(reader.result));
      setUseCamera(false);
    };
    reader.readAsDataURL(f);
  };

  const saveSnapshot = async () => {
    const canvas = canvasHolderRef.current?.querySelector("canvas");
    if (!canvas) return alert("Preview not ready yet");
    try {
      const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
      const res = await fetch("/api/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      if (res.ok) alert("Saved! View in your account gallery.");
      else alert("Save failed. Please sign in.");
    } catch (err) {
      console.error("Snapshot save failed", err);
      alert("Something went wrong while saving.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">Virtual Try-On</h1>
      <p className="text-gray-600 mb-6">Use your webcam or upload a photo. Adjust fit if needed.</p>

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.overlay}
              alt={f.name}
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
          Use Webcam
        </button>
        <button
          onClick={onPickFile}
          className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
            !useCamera
              ? "bg-purple-700 text-white"
              : "border-purple-700 text-purple-700 hover:bg-purple-50"
          }`}
        >
          Upload Photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {/* Sliders */}
        <label className="ml-4 text-sm font-medium">Scale</label>
        <input
          type="range"
          min={1.6}
          max={3.2}
          step={0.1}
          value={scaleFactor}
          onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
        />

        <label className="ml-4 text-sm font-medium">Vertical Offset</label>
        <input
          type="range"
          min={-80}
          max={40}
          step={2}
          value={vOffset}
          onChange={(e) => setVOffset(parseFloat(e.target.value))}
        />
      </div>

      {/* TryOn Preview */}
      <div ref={canvasHolderRef}>
        <VirtualTryOn
          key={selected.id} // ensures re-render when frame changes
          productImage={selected.overlay}
          useCamera={useCamera}
          userImageSrc={userImageSrc}
          scaleFactor={scaleFactor}
          verticalOffset={vOffset}
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={saveSnapshot}
          className="px-5 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors"
        >
          Save Snapshot
        </button>
        <Link href="/account/gallery" className="text-purple-700 hover:underline">
          View Gallery
        </Link>
      </div>
    </section>
  );
}
