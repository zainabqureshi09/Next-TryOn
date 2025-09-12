"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface VirtualTryOnProps {
  productImage: string; // overlay PNG (transparent recommended)
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);

  const [usingCamera, setUsingCamera] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [faceFound, setFaceFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Smoothing state
  const smoothX = useRef<number | null>(null);
  const smoothY = useRef<number | null>(null);
  const smoothAngle = useRef<number | null>(null);

  // preload overlay image
  useEffect(() => {
    const img = new Image();
    img.src = productImage;
    img.onload = () => (overlayRef.current = img);
  }, [productImage]);

  // load models
  useEffect(() => {
    (async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        setLoadingModels(false);
      } catch (err) {
        setError("Failed to load models. Check /models path.");
      }
    })();
  }, []);

  // camera handling
  useEffect(() => {
    let animationFrame: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpAngle = (a: number, b: number, t: number) => {
      const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
      return a + diff * t;
    };

    const detectFace = async (input: HTMLVideoElement | HTMLImageElement) => {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });
      return faceapi.detectSingleFace(input, options).withFaceLandmarks();
    };

    const render = async () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let input: HTMLVideoElement | HTMLImageElement | null = null;
      if (usingCamera && videoRef.current) input = videoRef.current;
      if (!usingCamera && uploadedImage) {
        const img = new Image();
        img.src = uploadedImage;
        await new Promise((res) => (img.onload = res));
        input = img;
      }
      if (!input) return;

      const width = input instanceof HTMLVideoElement ? input.videoWidth : input.width;
      const height = input instanceof HTMLVideoElement ? input.videoHeight : input.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(input, 0, 0, width, height);

      const detection = await detectFace(input);
      if (detection && overlayRef.current) {
        setFaceFound(true);
        const leftEye = detection.landmarks.getLeftEye();
        const rightEye = detection.landmarks.getRightEye();

        const left = leftEye[0];
        const right = rightEye[3];

        const centerX = (left.x + right.x) / 2;
        const centerY = (left.y + right.y) / 2;
        const eyeDistance = Math.hypot(right.x - left.x, right.y - left.y);
        const overlayWidth = eyeDistance * 2.4;
        const overlayHeight = overlayWidth * 0.45;
        const angle = Math.atan2(right.y - left.y, right.x - left.x);
        const yOffset = -overlayHeight * 0.55;

        // smoothing
        const t = 0.25;
        smoothX.current = smoothX.current == null ? centerX : lerp(smoothX.current, centerX, t);
        smoothY.current = smoothY.current == null ? centerY : lerp(smoothY.current, centerY, t);
        smoothAngle.current =
          smoothAngle.current == null ? angle : lerpAngle(smoothAngle.current, angle, t);

        ctx.save();
        ctx.translate(smoothX.current, smoothY.current);
        ctx.rotate(smoothAngle.current);
        ctx.drawImage(
          overlayRef.current,
          -overlayWidth / 2,
          yOffset,
          overlayWidth,
          overlayHeight
        );
        ctx.restore();
      } else {
        setFaceFound(false);
      }

      animationFrame = requestAnimationFrame(render);
    };

    if (!loadingModels) {
      render();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [usingCamera, uploadedImage, loadingModels]);

  // start/stop camera
  useEffect(() => {
    if (usingCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => setError("Camera not available."));
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [usingCamera]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setUsingCamera(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="relative rounded-xl overflow-hidden bg-gray-200">
        {usingCamera && (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-3 left-3 text-xs text-white px-2 py-1 rounded bg-black/50">
          {loadingModels ? "Loading models..." : faceFound ? "Face detected" : "Detecting..."}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setUsingCamera(true)}
          className={`px-4 py-2 rounded-md border ${
            usingCamera ? "bg-purple-600 text-white" : "bg-white"
          }`}
        >
          Use Camera
        </button>
        <label className="px-4 py-2 rounded-md border bg-white cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
      </div>
    </div>
  );
};

export default VirtualTryOn;
