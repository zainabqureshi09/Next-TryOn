"use client";

import { useEffect, useRef, useState } from "react";

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

      // Overlay (glasses)
      if (
        overlayRef.current instanceof HTMLImageElement &&
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
    <div className="relative w-full flex justify-center">
      {useCamera && (
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      )}

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border rounded-xl"
      />

      {/* Hidden overlay image for canvas */}
      <img ref={overlayRef} src={productImage} alt="overlay glasses" className="hidden" />
    </div>
  );
}
