// components/VirtualTryOn.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

export interface VirtualTryOnProps {
  productImage: string; // overlay image (single sprite used for glasses/hats/earrings)
  useCamera: boolean;
  userImageSrc: string | null;
  scaleFactor?: number; // overall multiplier for product size
  verticalOffset?: number; // px offset applied after positioning
  horizontalOffset?: number; // px offset applied after positioning (new)
  productType?: "glasses" | "hat" | "earrings";
  // detectionInterval in ms (how often to run face detection)
  detectionInterval?: number;
  // optional: show small product preview below canvas (default true)
  showProductPreview?: boolean;
}

export default function VirtualTryOn({
  productImage,
  useCamera,
  userImageSrc,
  scaleFactor = 1,
  verticalOffset = 0,
  horizontalOffset = 0,
  productType = "glasses",
  detectionInterval = 500,
  showProductPreview = true,
}: VirtualTryOnProps) {
  // Refs & state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectionTimerRef = useRef<number | null>(null);

  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
  const [cameraReady, setCameraReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceLandmarks, setFaceLandmarks] = useState<faceapi.FaceLandmarks68 | null>(null);

  // ---- 1) Load face-api / TF models (async)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // prefer webgl -> fallback to cpu
        await tf.setBackend("webgl").catch(async () => {
          await tf.setBackend("cpu");
        });
        await tf.ready();

        // Make sure you have model files in /public/models/*
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);

        if (mounted) {
          setModelsLoaded(true);
          setError(null);
        }
      } catch (e) {
        console.error("Failed loading models:", e);
        if (mounted) setError("Failed to load face detection models. Place models in /public/models.");
      }
    };

    load();
    return () => {
      mounted = false;
      // dispose TF variables if necessary
      try {
        tf.engine().disposeVariables?.();
      } catch {}
    };
  }, []);

  // ---- 2) Load overlay product image (single image used for glasses/hats/earrings)
  useEffect(() => {
    if (!productImage) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => (overlayRef.current = img);
    img.onerror = () => setError("Failed to load product image.");
    img.src = productImage;
    // no cleanup necessary; overlayRef will be overwritten on next load
  }, [productImage]);

  // ---- 3) Load user-uploaded image (if any) into an HTMLImageElement
  useEffect(() => {
    if (!userImageSrc) {
      setBgImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBgImg(img);
    };
    img.onerror = () => setError("Failed to load uploaded image.");
    img.src = userImageSrc;
    return () => setBgImg(null);
  }, [userImageSrc]);

  // ---- 4) Camera lifecycle
  useEffect(() => {
    // start camera when useCamera true, stop on false/unmount
    let active = true;
    if (!useCamera) {
      setCameraReady(false);
      // stop any existing stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 1280, height: 720 },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // try to play (some browsers need .play() call)
            videoRef.current?.play().catch(() => {});
            setCameraReady(true);
          };
        }
      } catch (e) {
        console.error("Camera error:", e);
        setError("Camera access denied or not available.");
        setCameraReady(false);
      }
    };

    start();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraReady(false);
    };
  }, [useCamera]);

  // ---- 5) Responsive canvas sizing using ResizeObserver
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = Math.round(width * 0.75); // 4:3 default
      setCanvasSize({ width, height });
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ---- 6) Helper: average point
  const avgPoint = (pts: faceapi.Point[]) => {
    const sum = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / pts.length, y: sum.y / pts.length };
  };

  // ---- 7) Face detection loop (runs at detectionInterval, cheaper than per-frame)
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectOnce = async () => {
      try {
        const inputEl = useCamera ? videoRef.current : bgImg;
        if (!inputEl) {
          setFaceLandmarks(null);
          return;
        }

        // Make sure input has natural/video size
        const inputWidth = useCamera ? videoRef.current?.videoWidth : bgImg?.naturalWidth;
        const inputHeight = useCamera ? videoRef.current?.videoHeight : bgImg?.naturalHeight;
        if (!inputWidth || !inputHeight) {
          // Wait until sizes available
          return;
        }

        const result = await faceapi
          .detectSingleFace(inputEl as any, new faceapi.TinyFaceDetectorOptions({ inputSize: 256 }))
          .withFaceLandmarks();

        if (result?.landmarks) {
          setFaceLandmarks(result.landmarks);
          setError(null);
        } else {
          setFaceLandmarks(null); // no face found
        }
      } catch (e) {
        console.error("Face detection error:", e);
      }
    };

    // initial detect (for uploaded images)
    if (!useCamera) {
      detectOnce();
    }

    // schedule interval for camera
    if (useCamera) {
      if (detectionTimerRef.current) window.clearInterval(detectionTimerRef.current);
      detectionTimerRef.current = window.setInterval(detectOnce, detectionInterval);
    }

    return () => {
      if (detectionTimerRef.current) {
        window.clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
    };
  }, [modelsLoaded, useCamera, bgImg, detectionInterval]);

  // ---- 8) Compute overlay position (maps input coords -> canvas coords)
  const computeOverlayPosition = () => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return null;

    // Determine input dimensions (video or image)
    const inputW = useCamera ? (videoRef.current?.videoWidth || 0) : (bgImg?.naturalWidth || 0);
    const inputH = useCamera ? (videoRef.current?.videoHeight || 0) : (bgImg?.naturalHeight || 0);

    if (inputW === 0 || inputH === 0) {
      return null;
    }

    // scale from input coordinate system to canvas coordinate system
    // we compute separate scaleX/scaleY (in case aspect differ), and use avgScale for sizes
    const scaleX = canvas.width / inputW;
    const scaleY = canvas.height / inputH;
    const avgScale = (scaleX + scaleY) / 2;

    // If we have faceLandmarks, compute anchored positions per product type
    if (faceLandmarks) {
      // eyes center
      const leftEyeCenter = avgPoint(faceLandmarks.getLeftEye());
      const rightEyeCenter = avgPoint(faceLandmarks.getRightEye());
      const noseTip = faceLandmarks.getNose()[3]; // approximate center of nose tip
      const jaw = faceLandmarks.getJawOutline();

      // helper: convert input point to canvas point
      const toCanvas = (p: faceapi.Point) => ({ x: p.x * scaleX, y: p.y * scaleY });

      if (productType === "glasses") {
        // base width from eye distance
        const eyeDistance = Math.hypot(rightEyeCenter.x - leftEyeCenter.x, rightEyeCenter.y - leftEyeCenter.y);
        const width = eyeDistance * 2.2 * avgScale * scaleFactor;
        const height = width * 0.6; // glasses ratio, tweakable per product
        const centerInput = { x: (leftEyeCenter.x + rightEyeCenter.x) / 2, y: (leftEyeCenter.y + rightEyeCenter.y) / 2 };
        const center = toCanvas(new faceapi.Point(centerInput.x, centerInput.y));
        return {
          x: center.x - width / 2 + horizontalOffset,
          y: center.y - height / 2 + verticalOffset,
          width,
          height,
        };
      }

      if (productType === "hat") {
        // estimate head top position: use nose and jaw to get head height, place hat above nose
        const jawTop = jaw.reduce((min, p) => (p.y < min ? p.y : min), Infinity);
        const jawBottom = jaw.reduce((max, p) => (p.y > max ? p.y : max), -Infinity);
        const headHeight = jawBottom - jawTop || 200;
        const width = headHeight * 2.0 * avgScale * scaleFactor;
        const height = width * (overlay.naturalHeight / overlay.naturalWidth || 0.7);
        const foreheadInput = { x: noseTip.x, y: Math.max(0, noseTip.y - headHeight * 0.35) };
        const center = toCanvas(new faceapi.Point(foreheadInput.x, foreheadInput.y));
        return {
          x: center.x - width / 2 + horizontalOffset,
          y: center.y - height * 1.05 + verticalOffset, // lift hat above forehead
          width,
          height,
        };
      }

      if (productType === "earrings") {
        // Earrings: place two small overlays at approximate ear positions using jaw outline
        // left ear -> jaw[2], right ear -> jaw[14] (approx)
        const leftEar = jaw[2];
        const rightEar = jaw[14];
        const earSize = (Math.hypot(rightEyeCenter.x - leftEyeCenter.x, rightEyeCenter.y - leftEyeCenter.y) * 0.35) * avgScale * scaleFactor;
        const left = toCanvas(leftEar);
        const right = toCanvas(rightEar);
        return [
          { x: left.x - earSize / 2 + horizontalOffset, y: left.y - earSize / 2 + verticalOffset, width: earSize, height: earSize },
          { x: right.x - earSize / 2 + horizontalOffset, y: right.y - earSize / 2 + verticalOffset, width: earSize, height: earSize },
        ];
      }
    }

    // fallback (no face detected): center overlay at reasonable size
    const fallbackW = canvas.width * 0.45 * scaleFactor;
    const fallbackH = (overlay.naturalHeight / overlay.naturalWidth) * fallbackW;
    return {
      x: canvas.width / 2 - fallbackW / 2 + horizontalOffset,
      y: canvas.height / 2 - fallbackH / 2 + verticalOffset,
      width: fallbackW,
      height: fallbackH,
    };
  };

  // ---- 9) Render loop (runs with requestAnimationFrame; draws background + overlay)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // set canvas resolution to chosen canvasSize
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const render = () => {
      // draw background: camera frame if available, else bgImg if uploaded else black
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (useCamera && videoRef.current && cameraReady && videoRef.current.videoWidth > 0) {
        try {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          // sometimes drawImage from video throws early; ignore
        }
      } else if (bgImg) {
        // draw uploaded image filling the canvas area (stretch to fit)
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // draw overlay(s)
      const overlay = overlayRef.current;
      if (overlay) {
        const pos = computeOverlayPosition();
        if (Array.isArray(pos)) {
          // multiple overlays (earrings)
          pos.forEach((p) => {
            if (p.width > 0 && p.height > 0) ctx.drawImage(overlay, p.x, p.y, p.width, p.height);
          });
        } else if (pos) {
          if (pos.width > 0 && pos.height > 0) ctx.drawImage(overlay, pos.x, pos.y, pos.width, pos.height);
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [canvasSize, bgImg, cameraReady, faceLandmarks, overlayRef.current, scaleFactor, verticalOffset, horizontalOffset, useCamera, productType]);

  // ---- 10) Cleanup on unmount: stop camera & detection timer
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (detectionTimerRef.current) {
        window.clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // ---- 11) Small debug/status UI below canvas (you can hide by props)
  return (
    <div ref={containerRef} className="w-full flex flex-col items-center gap-2">
      {/* Hidden video element used as input when camera active */}
      {useCamera && (
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      )}

      <canvas
        ref={canvasRef}
        style={{ width: "100%", maxWidth: 640, height: canvasSize.height }}
        className="border rounded-xl bg-black"
      />

      {error && <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mt-2 flex items-center gap-3">
        <div className="text-sm text-gray-600">
          {modelsLoaded ? (
            faceLandmarks ? (
              <span className="text-green-600">Face detected</span>
            ) : (
              <span className="text-yellow-600">Searching for face...</span>
            )
          ) : (
            <span className="text-gray-500">Loading models...</span>
          )}
        </div>

        {showProductPreview && overlayRef.current && (
          <div className="ml-2">
            <NextImage src={productImage} alt="product preview" width={60} height={60} unoptimized className="rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
