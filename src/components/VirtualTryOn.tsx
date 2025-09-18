"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

export interface VirtualTryOnProps {
  productImage: string;
  useCamera: boolean;
  userImageSrc: string | null;
  scaleFactor?: number;
  verticalOffset?: number;
  productType?: "glasses" | "hat" | "earrings";
}

export default function VirtualTryOn({
  productImage,
  useCamera,
  userImageSrc,
  scaleFactor = 1,
  verticalOffset = 0,
  productType = "glasses",
}: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceLandmarks, setFaceLandmarks] = useState<faceapi.FaceLandmarks68 | null>(null);

  // 1) load face-api models (place models in /public/models)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // prefer webgl, fallback to cpu
        await tf.setBackend("webgl").catch(async () => {
          await tf.setBackend("cpu");
        });
        await tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);

        if (mounted) {
          setModelsLoaded(true);
          setError(null);
        }
      } catch (e) {
        console.error("Model load error:", e);
        if (mounted) setError("Failed to load face detection models. Put models in /public/models or disable face detection.");
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // 2) handle uploaded user image -> create HTMLImageElement
  useEffect(() => {
    if (!userImageSrc) {
      setBgImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImg(img);
    img.onerror = () => setError("Could not load user image.");
    img.src = userImageSrc;
    return () => setBgImg(null);
  }, [userImageSrc]);

  // 3) load overlay image (product)
  useEffect(() => {
    if (!productImage) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => (overlayRef.current = img);
    img.onerror = () => setError("Could not load product overlay.");
    img.src = productImage;
  }, [productImage]);

  // 4) camera setup / teardown
  useEffect(() => {
    let active = true;
    if (!useCamera) {
      setCameraReady(false);
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 1280, height: 720 },
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // wait for metadata to load for sizes
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
            setCameraReady(true);
          };
        }
      } catch (e) {
        console.error(e);
        setError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraReady(false);
    };
  }, [useCamera]);

  // 5) responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      setCanvasSize({ width, height: Math.round(width * 0.75) });
    };

    updateSize();
    const obs = new ResizeObserver(updateSize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // 6) face detection loop (runs on interval to be performant)
  useEffect(() => {
    if (!modelsLoaded) return;
    let intervalId: number | undefined;

    const detectOnce = async () => {
      try {
        const inputEl = useCamera ? videoRef.current : bgImg;
        if (!inputEl) return;

        const inputWidth = (useCamera ? videoRef.current?.videoWidth : bgImg?.naturalWidth) || 0;
        const inputHeight = (useCamera ? videoRef.current?.videoHeight : bgImg?.naturalHeight) || 0;
        if (inputWidth === 0 || inputHeight === 0) {
          // Wait until input has sizes
          return;
        }

        const detection = await faceapi
          .detectSingleFace(inputEl as any, new faceapi.TinyFaceDetectorOptions({ inputSize: 256 }))
          .withFaceLandmarks();

        if (detection?.landmarks) {
          setFaceLandmarks(detection.landmarks);
          setError(null);
        } else {
          setFaceLandmarks(null);
        }
      } catch (e) {
        console.error("Detection error:", e);
      }
    };

    if (useCamera) {
      // poll camera every 400ms
      intervalId = window.setInterval(detectOnce, 400);
    } else {
      // single detection for uploaded images (async)
      detectOnce();
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [modelsLoaded, useCamera, bgImg, cameraReady]);

  // helper to average array of points
  const avgPoint = (pts: faceapi.Point[]) => {
    const s = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: s.x / pts.length, y: s.y / pts.length };
  };

  // calculate overlay position in canvas coordinates
  const computeOverlayPos = () => {
    const canvas = canvasRef.current;
    if (!canvas || !overlayRef.current) return null;

    const inputWidth = useCamera ? (videoRef.current?.videoWidth || 0) : (bgImg?.naturalWidth || 0);
    const inputHeight = useCamera ? (videoRef.current?.videoHeight || 0) : (bgImg?.naturalHeight || 0);

    if (inputWidth === 0 || inputHeight === 0) return null;

    // scale factors from input -> canvas
    const scaleX = canvas.width / inputWidth;
    const scaleY = canvas.height / inputHeight;
    const avgScale = (scaleX + scaleY) / 2;

    if (faceLandmarks) {
      const leftEyePts = faceLandmarks.getLeftEye();
      const rightEyePts = faceLandmarks.getRightEye();

      const left = avgPoint(leftEyePts);
      const right = avgPoint(rightEyePts);

      const eyeDist = Math.hypot(right.x - left.x, right.y - left.y);
      // center in input coords
      const centerX = (left.x + right.x) / 2;
      const centerY = (left.y + right.y) / 2;

      // convert to canvas coords
      const cx = centerX * scaleX;
      const cy = centerY * scaleY;

      // width proportional to eye distance
      const width = eyeDist * 1.8 * avgScale * scaleFactor;
      const height = width * 0.6; // reasonable ratio for glasses; adjust per productType if needed

      return {
        x: cx - width / 2,
        y: cy - height / 2 + verticalOffset, // verticalOffset in canvas px
        width,
        height,
      };
    }

    // fallback: center overlay
    const fallbackWidth = canvas.width * 0.45 * scaleFactor;
    const fallbackHeight = (overlayRef.current.naturalHeight / overlayRef.current.naturalWidth) * fallbackWidth;
    return {
      x: (canvas.width - fallbackWidth) / 2,
      y: (canvas.height - fallbackHeight) / 2 + verticalOffset,
      width: fallbackWidth,
      height: fallbackHeight,
    };
  };

  // 7) render loop (draws background + overlay)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw background: camera or uploaded
      if (useCamera && videoRef.current && cameraReady && videoRef.current.videoWidth > 0) {
        try {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          // drawing might fail early
        }
      } else if (bgImg) {
        // preserve aspect by filling
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        // blank
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // overlay
      if (overlayRef.current) {
        const pos = computeOverlayPos();
        if (pos) {
          ctx.drawImage(overlayRef.current, pos.x, pos.y, pos.width, pos.height);
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasSize, bgImg, useCamera, cameraReady, faceLandmarks, scaleFactor, verticalOffset]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center gap-2">
      {useCamera && (
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      )}

      <canvas
        ref={canvasRef}
        className="border rounded-xl w-full max-w-[640px] bg-black"
        style={{ height: canvasSize.height }}
      />

      {error && <div className="mt-2 p-2 bg-red-100 text-red-600 rounded">{error}</div>}

      <div className="mt-2">
        <NextImage src={productImage} alt="Product" width={200} height={200} unoptimized />
      </div>
    </div>
  );
}
