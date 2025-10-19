"use client";

import { useState } from "react";
import { FaceLandmarks } from "./useFaceTracking";

// Simplified version without MediaPipe to avoid compatibility issues
export const useImageFaceTracking = (
  imageRef: React.RefObject<HTMLImageElement | null>
) => {
  const [landmarks] = useState<FaceLandmarks | null>(null);
  const [isDetecting] = useState(false);

  // Simplified hook - no MediaPipe processing for images to avoid compatibility issues
  // This prevents the Module.arguments error entirely

  return { landmarks, isDetecting };
};
