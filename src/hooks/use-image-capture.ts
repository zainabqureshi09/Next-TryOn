"use client";

import { useRef, useCallback } from "react";
import { useToast } from "./use-toast";

export const useImageCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  // Helper: ensure we always use a single offscreen canvas
  const getCanvas = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    return canvasRef.current;
  };

  const captureFromVideo = useCallback(
    async (
      videoElement: HTMLVideoElement,
      glassesCanvas?: HTMLCanvasElement,
      format: "image/png" | "image/jpeg" = "image/png",
      quality: number = 0.92 // JPEG quality (0–1), ignored for PNG
    ): Promise<string> => {
      if (typeof window === "undefined") return Promise.reject("SSR");

      try {
        const canvas = getCanvas();
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Match canvas to video size
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Clear before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw mirrored video frame
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Draw overlay if provided
        if (glassesCanvas) {
          ctx.drawImage(glassesCanvas, 0, 0, canvas.width, canvas.height);
        }

        return canvas.toDataURL(format, quality);
      } catch (error) {
        toast.error("Capture failed", {
          description: (error as Error).message,
        });
        return Promise.reject(error);
      }
    },
    [toast]
  );

  const captureFromImage = useCallback(
    async (
      imageElement: HTMLImageElement,
      glassesCanvas?: HTMLCanvasElement,
      format: "image/png" | "image/jpeg" = "image/png",
      quality: number = 0.92
    ): Promise<string> => {
      if (typeof window === "undefined") return Promise.reject("SSR");

      try {
        const canvas = getCanvas();
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Match canvas to image size
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;

        // Clear before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        // Draw overlay if provided
        if (glassesCanvas) {
          ctx.drawImage(glassesCanvas, 0, 0, canvas.width, canvas.height);
        }

        return canvas.toDataURL(format, quality);
      } catch (error) {
        toast.error("Capture failed", {
          description: (error as Error).message,
        });
        return Promise.reject(error);
      }
    },
    [toast]
  );

  const downloadImage = useCallback(
    (dataURL: string, filename: string = "glasses-try-on.png") => {
      if (typeof window === "undefined") return;

      try {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Image saved!", {
          description: "Your try-on photo has been downloaded.",
        });
      } catch (error) {
        toast.error("Save failed", {
          description: "Could not save the image. Please try again.",
        });
      }
    },
    [toast]
  );

  return {
    captureFromVideo,
    captureFromImage,
    downloadImage,
    canvasRef, // Expose for debugging or custom drawing
  };
};
