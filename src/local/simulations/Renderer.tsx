"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface RendererProps {
  children?: React.ReactNode;
}

export default function Renderer({ children }: RendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 size-full relative overflow-hidden min-h-0 bg-surface-white" />
    );
  }

  return (
    <div className="flex-1 size-full relative overflow-hidden min-h-0 bg-surface-white">
      <div className="absolute inset-0 size-full">
        <Canvas
          camera={{ position: [0, 0.25, 1.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Clean Light-Mode Educational Studio Lighting */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[8, 10, 5]} intensity={1.3} />
          <directionalLight position={[-8, -5, -5]} intensity={0.4} color="#94a3b8" />
          <pointLight position={[0, 4, 2]} intensity={0.8} />

          {/* Centered Floating 3D Model Scene */}
          <group position={[0, 0, 0]}>
            {children}
          </group>

          {/* Constrained Camera Orbit (Light-mode interactive viewing) */}
          <OrbitControls
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={0.8}
            maxDistance={4.5}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />
        </Canvas>
      </div>
    </div>
  );
}