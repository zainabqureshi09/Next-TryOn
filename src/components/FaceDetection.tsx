"use client";

import { useEffect, useRef } from "react";
import type { FaceLandmarks } from "@/hooks/useFaceTracking";

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarks?: FaceLandmarks | null;
  debug?: boolean;
}

export default function FaceDetection({
  videoRef,
  landmarks,
  debug = false,
}: FaceDetectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync canvas size with video
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const resizeCanvas = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      // Draw overlay guide after resize
      drawOverlay();
    };

    const drawOverlay = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Face oval guide
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rx = Math.min(canvas.width, canvas.height) * 0.28;
      const ry = rx * 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // If landmarks present and debug enabled, render key points
      if (debug && landmarks) {
        ctx.save();
        ctx.fillStyle = "#00FF9D";
        const pts = [landmarks.leftEye, landmarks.rightEye, landmarks.noseTip];
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(video);
    video.addEventListener("loadedmetadata", resizeCanvas);

    return () => {
      resizeObserver.disconnect();
      video.removeEventListener("loadedmetadata", resizeCanvas);
    };
  }, [videoRef, landmarks, debug]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        transform: "scaleX(-1)",
        mixBlendMode: debug ? "screen" : "normal",
      }}
    />
  );
}
