"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CareerGlobeMesh } from "./CareerGlobeMesh";
import { DomainNodes } from "./DomainNodes";
import { TraitsConstellation } from "./TraitsConstellation";
import { HierarchySpatialReveal } from "./HierarchySpatialReveal";
import { TrajectoryConvergence } from "./TrajectoryConvergence";
import { useThree } from "@react-three/fiber";

interface GlobeCameraRigProps {
  scrollProgress: number;
  isReducedMotion?: boolean;
}

function GlobeCameraRig({ scrollProgress, isReducedMotion = false }: GlobeCameraRigProps) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const baseZ = isMobile ? 7.6 : 6.2;

  useFrame(({ camera }) => {
    if (isReducedMotion) {
      camera.position.set(0, 0, baseZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Camera zooms closer during hierarchy reveal (0.48 -> 0.72)
    let targetZ = baseZ;
    let targetY = 0;

    if (scrollProgress >= 0.48 && scrollProgress <= 0.72) {
      // Zoom into the front domain
      const zoomFactor = Math.sin(((scrollProgress - 0.48) / (0.72 - 0.48)) * Math.PI);
      targetZ = baseZ - (isMobile ? 1.0 : 1.4) * zoomFactor;
      targetY = -0.2 * zoomFactor;
    } else if (scrollProgress > 0.84) {
      // Pull back slightly during final CTA
      targetZ = baseZ + 0.3;
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface CareerGlobeCanvasProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

export function CareerGlobeCanvas({
  scrollProgress,
  isReducedMotion = false,
}: CareerGlobeCanvasProps) {
  // Smoothly fade out the entire 3D canvas before the final CTA
  // Drops to 0 opacity between 0.80 and 0.85, unmounting completely by 0.85
  const canvasOpacity = useMemo(() => {
    if (scrollProgress <= 0.80) return 1.0;
    if (scrollProgress >= 0.85) return 0.0;
    return 1.0 - (scrollProgress - 0.80) / (0.85 - 0.80);
  }, [scrollProgress]);

  if (canvasOpacity <= 0.001) return null;

  return (
    <div
      style={{ opacity: canvasOpacity }}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-150"
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <GlobeCameraRig
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />

        {/* Cinematic Futuristic Lighting */}
        <ambientLight color="#0F172A" intensity={0.9} />
        <directionalLight position={[5, 4, 6]} color="#38BDF8" intensity={1.6} />
        <pointLight position={[-5, -3, -3]} color="#818CF8" intensity={1.2} />
        <pointLight position={[0, -4, 2]} color="#00E5FF" intensity={0.7} />

        {/* The 3D Career Globe Core Primitives */}
        <CareerGlobeMesh
          radius={2.35}
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />

        <DomainNodes
          radius={2.35}
          scrollProgress={scrollProgress}
        />

        <TraitsConstellation
          radius={2.35}
          scrollProgress={scrollProgress}
        />

        <HierarchySpatialReveal
          radius={2.35}
          scrollProgress={scrollProgress}
        />

        <TrajectoryConvergence
          scrollProgress={scrollProgress}
        />
      </Canvas>
    </div>
  );
}
