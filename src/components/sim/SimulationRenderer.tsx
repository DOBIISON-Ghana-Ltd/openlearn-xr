'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ── Exported Renderer ─────────────────────────────────────────────────────────
interface SimulationRendererProps {
  children: React.ReactNode;
  camera?: any;
}

export function SimulationRenderer({ children, camera }: SimulationRendererProps) {
  return (
    <Canvas
      camera={camera}
      style={{ background: 'transparent' }}
      shadows={{ type: THREE.PCFShadowMap }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          screenSpacePanning={false}
          minDistance={3}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2 - 0.1}
          makeDefault
        />
        <color attach="background" args={['#f3f3f3']} />
        {/* Soft, transparent floor plane to catch shadows without affecting the background color */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>
        {children}
      </Suspense>
    </Canvas>
  );
}
