'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSimStore } from '@/store/play/store';

gsap.registerPlugin(useGSAP);

// ── Fluid Column ──────────────────────────────────────────────────────────────
function FluidColumn() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const density = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues['density'] ?? 1000
  );

  // Animate colour based on fluid type
  useGSAP(() => {
    if (!materialRef.current) return;
    const colors: Record<number, string> = {
      1000: '#3b82f6',    // water - blue
      1025: '#0ea5e9',    // seawater - lighter blue
      850: '#ca8a04',     // oil - amber
      13534: '#9ca3af',   // mercury - silver
    };
    const target = colors[density] ?? '#3b82f6';
    gsap.to(materialRef.current.color, {
      r: parseInt(target.slice(1, 3), 16) / 255,
      g: parseInt(target.slice(3, 5), 16) / 255,
      b: parseInt(target.slice(5, 7), 16) / 255,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { dependencies: [density] });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2.5, 8, 2.5]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3b82f6"
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Pressure Indicator Ball ───────────────────────────────────────────────────
function PressureBall() {
  const ballRef = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<any>(null!);

  const depth = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues['depth'] ?? 1
  );
  const density = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues['density'] ?? 1000
  );

  const g = 9.81;
  const pressure = (density * g * depth) / 1000; // in kPa

  // Animate vertical position when depth changes
  useGSAP(() => {
    if (!ballRef.current) return;
    // Map depth 0-10 to y position 3.5 -> -3.5 (top to bottom of column)
    const targetY = 3.5 - (depth / 10) * 7;
    gsap.to(ballRef.current.position, {
      y: targetY,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { dependencies: [depth] });

  // Animate pressure scale for visual feedback
  useGSAP(() => {
    if (!ballRef.current) return;
    const scale = 0.18 + (pressure / 1500) * 0.12;
    gsap.to(ballRef.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });
  }, { dependencies: [pressure] });

  return (
    <group>
      <mesh ref={ballRef} position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>

      {/* Depth line */}
      <mesh position={[1.55, 0, 0]}>
        <boxGeometry args={[0.025, 7, 0.025]} />
        <meshStandardMaterial color="#ffffff" opacity={0.15} transparent />
      </mesh>

      {/* Pressure readout */}
      <Text
        ref={labelRef}
        position={[2.8, -3.8, 0]}
        fontSize={0.22}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
      >
        {`P = ${pressure.toFixed(2)} kPa`}
      </Text>

      {/* Depth readout */}
      <Text
        position={[-2.8, -3.8, 0]}
        fontSize={0.22}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
      >
        {`h = ${Number(depth).toFixed(1)} m`}
      </Text>
    </group>
  );
}

// ── Beaker / Tank outline ─────────────────────────────────────────────────────
function Tank() {
  return (
    <group>
      {/* Front */}
      <mesh position={[0, 0, 1.26]}>
        <planeGeometry args={[2.5, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -4.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function PressureScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, 4, -4]} intensity={0.5} color="#818cf8" />
      <Environment preset="studio" />
      <Tank />
      <FluidColumn />
      <PressureBall />
    </>
  );
}

// ── Exported Sim ──────────────────────────────────────────────────────────────
export default function PressureDepthSim() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      style={{ background: 'transparent' }}
      shadows
    >
      <PressureScene />
    </Canvas>
  );
}
