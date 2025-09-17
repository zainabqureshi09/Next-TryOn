"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

export interface VirtualTryOnProps {
  productImage: string;
  useCamera: boolean;
  userImageSrc: string | null;
  scaleFactor?: number;
  verticalOffset?: number;
}

export default function VirtualTryOn({
  productImage,
  useCamera,
  userImageSrc,
  scaleFactor = 1,
  verticalOffset = 0,
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

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImg(img);
    img.onerror = () => {
      console.error("Failed to load user image");
      setBgImg(null);
    };
    img.src = userImageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [userImageSrc]);

  // Load product overlay image
  useEffect(() => {
    if (!productImage) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      overlayRef.current = img;
    };
    img.onerror = () => {
      console.error("Failed to load product overlay");
    };
    img.src = productImage;

    return () => {
      overlayRef.current = null;
    };
  }, [productImage]);

  // Start / stop camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (!useCamera || !videoRef.current) return;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access not supported in this browser");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background: camera or uploaded image
      if (useCamera && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      }

      // Overlay (product/glasses)
      if (overlayRef.current) {
        const w = overlayRef.current.naturalWidth * scaleFactor;
        const h = overlayRef.current.naturalHeight * scaleFactor;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2 + verticalOffset;
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
      {/* Hidden video for camera input */}
      {useCamera && (
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      )}

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border rounded-xl"
      />

      {/* Product Preview (for user to see the product separately) */}
      <div className="mt-2">
        <NextImage
          src={productImage}
          alt="Product preview"
          width={200}
          height={200}
          className="rounded-lg shadow"
          unoptimized
        />
      </div>
    </div>
  );
}
