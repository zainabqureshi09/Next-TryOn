"use client";

import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import GlassesModel from "./GlassesModel";
import { useFaceTracking } from "@/hooks/useFaceTracking";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import FaceDetection from "./FaceDetection";
import { isWebGLAvailable } from "@/utils/webgl-detection";

interface CameraProps {
  selectedGlasses: string;
  onError?: (message: string) => void;
}

export interface CameraRef {
  captureImage: () => Promise<string>;
  getVideoElement: () => HTMLVideoElement | null;
}

export const Camera = forwardRef<CameraRef, CameraProps>(
  ({ selectedGlasses, onError }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [webGLSupported, setWebGLSupported] = useState<boolean>(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [facingMode, setFacingMode] = useState<MediaTrackConstraints["facingMode"]>("user");

    // Safe face tracking with error boundary
    const [faceTrackingEnabled, setFaceTrackingEnabled] = useState(true);
    
    const safeFaceTracking = useFaceTracking(
      isVideoReady && faceTrackingEnabled ? videoRef : { current: null }
    );
    
    const landmarks = safeFaceTracking.landmarks;
    const isDetecting = safeFaceTracking.isDetecting;
    const faceTrackingError = safeFaceTracking.hasError;
    
    // Disable face tracking if there's an error
    useEffect(() => {
      if (faceTrackingError && faceTrackingEnabled) {
        console.warn("Face tracking disabled due to MediaPipe error");
        setFaceTrackingEnabled(false);
      }
    }, [faceTrackingError, faceTrackingEnabled]);

    // Capture snapshot
    useImperativeHandle(
      ref,
      () => ({
        captureImage: async () => {
          if (!videoRef.current)
            throw new Error("Video not available");

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not get canvas context");

          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          ctx.save();
          try {
            // Draw mirrored video
            ctx.scale(-1, 1);
            ctx.drawImage(
              videoRef.current,
              -canvas.width,
              0,
              canvas.width,
              canvas.height
            );
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Draw glasses overlay
            if (landmarks) {
              const glassesImg = new Image();
              glassesImg.src = `/frames/${selectedGlasses}.png`;

              await new Promise((resolve, reject) => {
                glassesImg.onload = resolve;
                glassesImg.onerror = reject;
              });

              const { leftEye, rightEye, noseTip } = landmarks;
              const eyeDistance = Math.sqrt(
                Math.pow(rightEye.x - leftEye.x, 2) +
                  Math.pow(rightEye.y - leftEye.y, 2)
              );

              const glassesWidth = Math.max(
                eyeDistance * canvas.width * 2,
                150
              );
              const aspect = glassesImg.width / glassesImg.height;
              const glassesHeight = glassesWidth / aspect;

              const x = noseTip.x * canvas.width - glassesWidth / 2;
              const y = noseTip.y * canvas.height - glassesHeight * 0.4;

              ctx.drawImage(glassesImg, x, y, glassesWidth, glassesHeight);
            }
          } finally {
            ctx.restore();
          }

          return canvas.toDataURL("image/png");
        },
        getVideoElement: () => videoRef.current,
      }),
      [landmarks, selectedGlasses]
    );

    // Initialize camera with responsive constraints
    useEffect(() => {
      let activeStream: MediaStream | null = null;

      const initCamera = async () => {
        try {
          const webGLSupport = typeof window !== "undefined" && isWebGLAvailable();
          setWebGLSupported(webGLSupport);

          // Compute responsive constraints
          const isPortrait = typeof window !== "undefined" && window.innerHeight > window.innerWidth;
          const idealWidth = isPortrait ? 720 : 1280;
          const idealHeight = isPortrait ? 1280 : 720;

          // Stop previous stream
          if (activeStream) {
            activeStream.getTracks().forEach((t) => t.stop());
          }
          if (stream) {
            stream.getTracks().forEach((t) => t.stop());
          }

          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: idealWidth },
              height: { ideal: idealHeight },
              facingMode: typeof facingMode === "string" ? { ideal: facingMode } : facingMode,
            },
            audio: false,
          });

          activeStream = mediaStream;
          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          setError(null);
          setIsLoading(false);
        } catch (err) {
          const message = "Camera access failed. Please enable permissions or try Photo Mode.";
          setError(message);
          setIsLoading(false);
          onError?.(message);
        }
      };

      initCamera();

      const handleResize = () => {
        initCamera();
      };

      window.addEventListener("orientationchange", handleResize);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("orientationchange", handleResize);
        window.removeEventListener("resize", handleResize);
        if (activeStream) {
          activeStream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [facingMode]);

    return (
      <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Camera preview"
          className="w-full h-full object-cover -scale-x-100"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.play();
              setIsVideoReady(true);
            }
          }}
        />

        {/* Face Detection Overlay */}
        <FaceDetection videoRef={videoRef} landmarks={landmarks || null} />

        {/* Glasses Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {webGLSupported && (
            <Suspense fallback={null}>
              <Canvas
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "scaleX(-1)",
                }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 1]} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[0, 0, 1]} intensity={0.8} />
                {landmarks && (
                  <GlassesModel
                    key={selectedGlasses}
                    glassesType={selectedGlasses}
                    landmarks={landmarks}
                  />
                )}
              </Canvas>
            </Suspense>
          )}
        </div>

        {/* Top Controls and Status */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <button
            aria-label="Flip camera"
            onClick={() => setFacingMode((prev) => (prev === "user" ? "environment" : "user"))}
            className="px-3 py-2 rounded-full bg-white/80 text-gray-900 hover:bg-white transition"
          >
            Flip
          </button>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {isLoading && (
            <Badge variant="secondary" className="bg-tech-surface/80 backdrop-blur-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
              Initializing...
            </Badge>
          )}

          {error && (
            <Badge variant="destructive" className="bg-destructive/80 backdrop-blur-sm">
              <AlertCircle className="w-3 h-3 mr-2" />
              Camera Error
            </Badge>
          )}

          {!error && !isLoading && (
            <Badge
              variant="secondary"
              className={`backdrop-blur-sm ${
                isDetecting
                  ? "bg-green-500/20 border-green-400/40 text-green-100"
                  : faceTrackingError
                  ? "bg-yellow-500/20 border-yellow-400/40 text-yellow-100"
                  : "bg-gray-500/20 border-gray-400/40 text-gray-100"
              }`}
            >
              {isDetecting ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Face Detected
                </>
              ) : faceTrackingError ? (
                <>
                  <AlertCircle className="w-3 h-3 mr-2" />
                  Basic Mode
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                  Looking for face...
                </>
              )}
            </Badge>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground font-medium">Starting camera...</p>
              <p className="text-muted-foreground text-sm">
                Please allow camera access
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Camera.displayName = "Camera";
