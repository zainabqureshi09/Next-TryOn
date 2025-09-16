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
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>();

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

  // Rendering
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const render = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw background (camera or uploaded image)
      if (useCamera && videoRef.current) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      } else if (userImageSrc) {
        const bgImg = new Image();
        bgImg.src = userImageSrc;
        bgImg.onload = () => {
          ctx.drawImage(
            bgImg,
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
        };
      }

      // Draw overlay (glasses/frame) only if loaded correctly
      if (
        overlayRef.current instanceof HTMLImageElement &&
        overlayRef.current.complete &&
        overlayRef.current.naturalWidth > 0
      ) {
        const w = overlayRef.current.naturalWidth * scaleFactor;
        const h = overlayRef.current.naturalHeight * scaleFactor;
        const x = (canvasRef.current.width - w) / 2;
        const y = (canvasRef.current.height - h) / 2 + verticalOffset;
        ctx.drawImage(overlayRef.current, x, y, w, h);
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [useCamera, userImageSrc, scaleFactor, verticalOffset]);

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

      {/* Hidden overlay frame (glasses) */}
      <img ref={overlayRef} src={productImage} alt="overlay" className="hidden" />
    </div>
  );
}
