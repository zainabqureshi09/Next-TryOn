"use client";

import { useEffect, useRef, useCallback } from "react";
import { FaceMesh, Results, NormalizedLandmarkList } from "@mediapipe/face_mesh";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onLandmarksDetected?: (landmarks: NormalizedLandmarkList) => void;
  debug?: boolean;
}

const LANDMARKS = {
  NOSE_TIP: 1,
  LEFT_EYE: 33,
  RIGHT_EYE: 263,
} as const;

export default function FaceDetection({
  videoRef,
  onLandmarksDetected,
  debug = false,
}: FaceDetectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);

  // ✅ Draw & handle detected landmarks
  const handleResults = useCallback(
    (results: Results) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks?.length) {
        const landmarks = results.multiFaceLandmarks[0];
        onLandmarksDetected?.(landmarks);

        if (debug) {
          ctx.strokeStyle = "#00FF9D";
          ctx.lineWidth = 1.2;
          ctx.fillStyle = "#FF2975";

          // Draw each landmark
          landmarks.forEach((lm) => {
            ctx.beginPath();
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          });

          // Highlight nose
          const nose = landmarks[LANDMARKS.NOSE_TIP];
          if (nose) {
            ctx.beginPath();
            ctx.arc(nose.x * canvas.width, nose.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    },
    [onLandmarksDetected, debug]
  );

  // ✅ Initialize FaceMesh and Camera
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    let isMounted = true;

    async function initializeFaceDetection() {
      try {
        // Cleanup any old instances
        faceMeshRef.current?.close();
        cameraRef.current?.stop();

        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        faceMesh.onResults(handleResults);
        faceMeshRef.current = faceMesh;

        const video = videoRef.current;
        if (!video) return;

        const startCamera = () => {
          try {
            const camera = new MediaPipeCamera(video, {
              onFrame: async () => {
                if (faceMeshRef.current && isMounted) {
                  await faceMeshRef.current.send({ image: video });
                }
              },
              width: 1280,
              height: 720,
            });
            camera.start();
            cameraRef.current = camera;
          } catch (err) {
            console.error("Camera initialization error:", err);
          }
        };

        if (video.readyState >= 2) startCamera();
        else video.addEventListener("loadeddata", startCamera, { once: true });
      } catch (err) {
        console.error("Face detection initialization error:", err);
      }
    }

    initializeFaceDetection();

    // ✅ Cleanup properly
    return () => {
      isMounted = false;
      cameraRef.current?.stop();
      faceMeshRef.current?.close();
      faceMeshRef.current = null;
      cameraRef.current = null;
    };
  }, [videoRef, handleResults]);

  // ✅ Sync canvas size with video
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const resizeCanvas = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
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
  }, [videoRef]);

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
