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
  const [error, setError] = useState<string | null>(null);

  // Load uploaded user image
  useEffect(() => {
    if (!userImageSrc) {
      setBgImg(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBgImg(img);
      setError(null);
    };
    img.onerror = () => {
      console.error("Failed to load user image");
      setBgImg(null);
      setError("Failed to load user image. Please try another image.");
    };
    img.src = userImageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [userImageSrc]);

  // Load product overlay image (instead of <img hidden>)
  useEffect(() => {
    if (!productImage) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      overlayRef.current = img;
    };
    img.onerror = () => {
      console.error("Failed to load product overlay");
      setError("Failed to load product overlay. Please try again.");
    };
    img.src = productImage;

    return () => {
      overlayRef.current = null;
    };
  }, [productImage]);

  // Start / stop camera
  useEffect(() => {
    let stream: MediaStream | undefined;

    async function startCamera() {
      if (!useCamera) return;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access not supported in this browser");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setError(null);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access failed. Please check permissions or try another browser.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
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

      // Draw background (camera / uploaded image)
      if (useCamera && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (bgImg) {
        const aspectRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / aspectRatio;

        if (drawHeight > canvas.height) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);
      }

      // Draw overlay (glasses/product)
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
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="hidden"
          onError={() => setError("Video stream error. Please try again.")}
        />
      )}

      {/* Error message */}
      {error && (
        <div className="w-full p-2 mb-2 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border rounded-xl"
      />

      {/* Product Preview */}
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
