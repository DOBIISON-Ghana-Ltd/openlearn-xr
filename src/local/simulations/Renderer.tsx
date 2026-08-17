"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface RendererProps {
  children?: React.ReactNode;
  /** DOM overlay rendered outside the Canvas — immune to camera rotation/panning */
  overlay?: React.ReactNode;
}

export default function Renderer({ children, overlay }: RendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gridStyle: React.CSSProperties = {
    backgroundColor: "#f4f8ff",
    backgroundImage:
      "linear-gradient(rgba(100, 160, 230, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 230, 0.18) 1px, transparent 1px)",
    backgroundSize: "36px 36px",
  };

  if (!mounted) {
    return (
      <div className="flex-1 size-full relative overflow-hidden min-h-0" style={gridStyle} />
    );
  }

  return (
    <div className="flex-1 size-full relative overflow-hidden min-h-0" style={gridStyle}>
      <div className="absolute inset-0 size-full">
        <Canvas
          camera={{ position: [0, 0.25, 1.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Clay studio lighting — soft key + fill, enough depth to see 3D form */}
          <ambientLight intensity={1.4} color="#f0f4ff" />
          <directionalLight position={[4, 8, 5]} intensity={1.1} color="#ffffff" />
          <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#ddeeff" />

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

      {/* DOM overlay — lives outside WebGL, immune to OrbitControls */}
      {overlay && (
        <div className="absolute inset-0 size-full pointer-events-none">
          {overlay}
        </div>
      )}
    </div>
  );
}