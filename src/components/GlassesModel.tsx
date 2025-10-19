"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import type { FaceLandmarks } from "@/hooks/useFaceTracking";

interface GlassesModelProps {
  glassesType: string;
  landmarks?: FaceLandmarks | null;
}

const glassesImages: Record<string, string> = {
  aviator1: "/frames/glasses.png",
  round1: "/frames/glasses2.png",
  sun1: "/frames/glasses.png",
  cat1: "/frames/glasses2.png",
};

export default function GlassesModel({ glassesType, landmarks }: GlassesModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useLoader(
    THREE.TextureLoader,
    glassesImages[glassesType] || glassesImages["aviator1"]
  );

  const { position, rotation, width, height } = useMemo(() => {
    if (!landmarks || !texture?.image) {
      return {
        position: [0, 0, -1] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        width: 1.5,
        height: 0.5,
      };
    }

    const { leftEye, rightEye, noseTip } = landmarks;

    // Eye center
    const x = (leftEye.x + rightEye.x) / 2;
    const y = (leftEye.y + rightEye.y) / 2;
    const z = noseTip.z;

    // Normalize to [-1,1] for screen space → Three.js
    const normalizedX = (x - 0.5) * 4;
    const normalizedY = -(y - 0.5) * 3;

    // Head tilt
    const eyeAngle = Math.atan2(
      rightEye.y - leftEye.y,
      rightEye.x - leftEye.x
    );

    // Eye distance for scale
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) +
      Math.pow(rightEye.y - leftEye.y, 2)
    );

    // Depth factor (normalize against z to keep glasses stable when moving away)
    const depthFactor = 1 / (z + 1.5); // adjust 1.5 for better scaling

    // Dynamic width
    const glassesWidth = Math.max(eyeDistance * 15 * depthFactor, 0.8);
    const aspect = texture.image.width && texture.image.height
      ? texture.image.width / texture.image.height
      : 2.5;
    const glassesHeight = glassesWidth / aspect;

    return {
      position: [normalizedX, normalizedY + 0.2, -1] as [number, number, number], // added +0.2 Y offset for above eyes
      rotation: [0, 0, -eyeAngle] as [number, number, number],
      width: glassesWidth,
      height: glassesHeight,
    };
  }, [landmarks, texture]);

  return React.createElement('group', 
    { ref: groupRef, position, rotation },
    React.createElement('mesh', {},
      React.createElement('planeGeometry', { args: [width, height] }),
      React.createElement('meshBasicMaterial', { map: texture, transparent: true, opacity: 1 })
    )
  );
}
