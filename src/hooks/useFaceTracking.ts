"use client";

// ✅ Fix for MediaPipe WASM compatibility issues
// This must be done before importing MediaPipe modules
if (typeof window !== "undefined") {
  (window as any).Module = (window as any).Module || {};
  
  // Handle both legacy and new MediaPipe versions
  if (!(window as any).Module.arguments_) {
    (window as any).Module.arguments_ = [];
  }
  
  // Create a property getter/setter for backward compatibility
  if (!(window as any).Module.arguments) {
    try {
      Object.defineProperty((window as any).Module, 'arguments', {
        get: () => (window as any).Module.arguments_,
        set: (val) => { (window as any).Module.arguments_ = val; },
        configurable: true
      });
    } catch (e) {
      // Fallback if property can't be defined
      (window as any).Module.arguments = [];
    }
  }
}

import { useEffect, useState, useRef } from "react";
import type { Results as FaceMeshResults } from "@mediapipe/face_mesh";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";

export interface FaceLandmarks {
  leftEye: { x: number; y: number; z: number };
  rightEye: { x: number; y: number; z: number };
  noseTip: { x: number; y: number; z: number };
  jawline: Array<{ x: number; y: number; z: number }>;
  forehead: { x: number; y: number; z: number };
}

export const useFaceTracking = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);

  useEffect(() => {
    // ✅ Prevent SSR execution
    if (typeof window === "undefined") return;
    if (!videoRef.current) return;
    if (hasError) return; // Don't retry if there was an error

    let cancelled = false;

    const initializeFaceTracking = async () => {
      try {
        // ✅ Initialize FaceMesh with error handling
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            try {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            } catch {
              // Fallback version
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
            }
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results: FaceMeshResults) => {
          if (cancelled) return;

          try {
            const faceLandmarks = results.multiFaceLandmarks?.[0];
            if (!faceLandmarks) {
              setLandmarks(null);
              setIsDetecting(false);
              return;
            }

            const leftEye = faceLandmarks[468] ?? faceLandmarks[33];
            const rightEye = faceLandmarks[473] ?? faceLandmarks[263];
            const noseTip = faceLandmarks[1];
            const forehead = faceLandmarks[10];

            const jawlineIndices = [
              172, 136, 150, 149, 176, 148, 152,
              377, 400, 378, 379, 365, 397, 288,
              361, 323,
            ];
            const jawline = jawlineIndices
              .map((i) => faceLandmarks[i])
              .filter(Boolean);

            if (leftEye && rightEye && noseTip && forehead) {
              setLandmarks({ leftEye, rightEye, noseTip, jawline, forehead });
              setIsDetecting(true);
            } else {
              setLandmarks(null);
              setIsDetecting(false);
            }
          } catch (err) {
            console.error("⚠️ Error processing landmarks:", err);
            setLandmarks(null);
            setIsDetecting(false);
          }
        });

        faceMeshRef.current = faceMesh;

        // ✅ Initialize camera
        const camera = new MediaPipeCamera(videoRef.current!, {
          onFrame: async () => {
            if (cancelled || !faceMeshRef.current || !videoRef.current) return;
            try {
              await faceMeshRef.current.send({ image: videoRef.current });
            } catch (err) {
              console.warn("⚠️ FaceMesh send error:", err);
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        camera.start();
      } catch (error) {
        console.error("Failed to initialize face tracking:", error);
        setHasError(true);
        setLandmarks(null);
        setIsDetecting(false);
      }
    };

    initializeFaceTracking();

    return () => {
      cancelled = true;
      cameraRef.current?.stop?.();
      faceMeshRef.current?.close();
      setLandmarks(null);
      setIsDetecting(false);
    };
  }, [videoRef, hasError]);

  return { landmarks, isDetecting, hasError };
};
