"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface VirtualTryOnProps {
  productImage: string;
  useCamera: boolean;
  userImageSrc: string | null;
  scaleFactor: number;
  verticalOffset: number;
}

export default function VirtualTryOn({
  productImage,
  useCamera,
  userImageSrc,
  scaleFactor,
  verticalOffset,
}: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>();

  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);

  // Load uploaded user image
  useEffect(() => {
    if (!userImageSrc) {
      setBgImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous"; // prevent CORS issue
    img.src = userImageSrc;
    img.onload = () => setBgImg(img);
  }, [userImageSrc]);

  // Start camera
  useEffect(() => {
    let stream: MediaStream;

    async function startCamera() {
      if (useCamera && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera error:", err);
        }
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useCamera]);

  // Rendering loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const render = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      // Background (camera / uploaded image)
      if (useCamera && videoRef.current) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
      } else if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      }

      // Overlay (glasses/product)
      if (
        overlayRef.current &&
        overlayRef.current.complete &&
        overlayRef.current.naturalWidth > 0
      ) {
        const w = overlayRef.current.naturalWidth * scaleFactor;
        const h = overlayRef.current.naturalHeight * scaleFactor;
        const x = (canvasRef.current!.width - w) / 2;
        const y = (canvasRef.current!.height - h) / 2 + verticalOffset;
        ctx.drawImage(overlayRef.current, x, y, w, h);
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [useCamera, bgImg, scaleFactor, verticalOffset]);

  return (
    <div className="relative w-full flex flex-col items-center gap-2">
      {useCamera && (
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      )}

      {/* Final Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border rounded-xl"
      />

      {/* UI me product image dikhane ke liye Next.js Image */}
      <div className="mt-2">
        <Image
          src={productImage}
          alt="Product preview"
          width={200}
          height={200}
          className="rounded-lg shadow"
          unoptimized // agar external domain se image aa rahi hai
        />
      </div>

      {/* Canvas ke liye hidden <img /> (native) */}
      <img
        ref={overlayRef}
        src={productImage}
        alt="overlay"
        className="hidden"
        crossOrigin="anonymous"
      />
    </div>
  );
}
