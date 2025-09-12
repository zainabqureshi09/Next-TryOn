"use client";

import { useEffect, useRef } from "react";

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
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const render = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (useCamera && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      } else if (userImageSrc) {
        const img = new Image();
        img.src = userImageSrc;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        };
      }

      if (imgRef.current) {
        const w = imgRef.current.width * scaleFactor;
        const h = imgRef.current.height * scaleFactor;
        const x = (canvasRef.current.width - w) / 2;
        const y = (canvasRef.current.height - h) / 2 + verticalOffset;
        ctx.drawImage(imgRef.current, x, y, w, h);
      }

      requestAnimationFrame(render);
    };

    render();
  }, [useCamera, userImageSrc, scaleFactor, verticalOffset]);

  return (
    <div className="relative w-full flex justify-center">
      {useCamera && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="hidden"
        />
      )}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border rounded-xl"
      />
      {/* Hidden frame overlay */}
      <img
        ref={imgRef}
        src={productImage}
        alt="frame overlay"
        className="hidden"
      />
    </div>
  );
}
