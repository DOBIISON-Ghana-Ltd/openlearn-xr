'use client';

import { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSimStore } from '@/store/play/store';

gsap.registerPlugin(useGSAP);

const HOLES = [
  { y3D: 2, realH: 2.5 },
  { y3D: 4, realH: 5.0 },
  { y3D: 6, realH: 7.5 },
];

function Barrel() {
  const points = useMemo(() => {
    const pts = [];
    const steps = 16;

    // Inner wall (bottom to top)
    for (let i = 0; i <= steps; i++) {
      const y = 0.15 + (i / steps) * (8 - 0.15);
      const r = 2.0 + Math.sin((y / 8) * Math.PI) * 0.4;
      pts.push(new THREE.Vector2(r - 0.15, y));
    }

    // Outer wall (top to bottom)
    for (let i = steps; i >= 0; i--) {
      const y = (i / steps) * 8;
      const r = 2.0 + Math.sin((y / 8) * Math.PI) * 0.4;
      pts.push(new THREE.Vector2(r, y));
    }

    // Close the loop at the bottom
    pts.push(new THREE.Vector2((2.0 + Math.sin((0.15 / 8) * Math.PI) * 0.4) - 0.15, 0.15));

    return pts;
  }, []);

  return (
    <group>
      {/* Main Wood Body */}
      <mesh receiveShadow castShadow>
        <latheGeometry args={[points, 16]} />
        <meshStandardMaterial
          color="#c45b16"
          roughness={0.9}
          flatShading
        />
      </mesh>
      {/* Bottom Cap (Inside) */}
      <mesh position={[0, 0.075, 0]} receiveShadow>
        <cylinderGeometry args={[1.85, 1.85, 0.15, 16]} />
        <meshStandardMaterial color="#8b3a0a" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function BarrelBand({ yStart, yEnd }: { yStart: number; yEnd: number }) {
  const points = useMemo(() => {
    const pts = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = yStart + (i / steps) * (yEnd - yStart);
      const r = 2.0 + Math.sin((y / 8) * Math.PI) * 0.4 + 0.04;
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, [yStart, yEnd]);

  return (
    <mesh receiveShadow castShadow>
      <latheGeometry args={[points, 16]} />
      <meshStandardMaterial color="#4a5b69" roughness={0.6} metalness={0.5} flatShading side={THREE.DoubleSide} />
    </mesh>
  );
}

interface FluidProps {
  depth: number;
  density: number;
}

function Fluid({ depth, density }: FluidProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const colors: Record<number, string> = {
    1000: '#3b82f6',    // water
    1025: '#0ea5e9',    // seawater
    850: '#ca8a04',     // oil
    13534: '#9ca3af',   // mercury
  };
  const target = colors[density] || '#3b82f6';

  useGSAP(() => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.color, {
      r: parseInt(target.slice(1, 3), 16) / 255,
      g: parseInt(target.slice(3, 5), 16) / 255,
      b: parseInt(target.slice(5, 7), 16) / 255,
      duration: 0.6,
    });
  }, { dependencies: [target] });

  const points = useMemo(() => {
    const pts = [new THREE.Vector2(0, 0.15)];
    const h3D = 0.15 + (depth / 10) * (8 - 0.15);

    if (depth > 0) {
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const y = 0.15 + (i / steps) * (h3D - 0.15);
        const r = 2.0 + Math.sin((y / 8) * Math.PI) * 0.4 - 0.16;
        pts.push(new THREE.Vector2(r, y));
      }
      pts.push(new THREE.Vector2(0, h3D));
    }
    return pts;
  }, [depth]);

  if (depth <= 0) return null;

  return (
    <mesh receiveShadow>
      <latheGeometry args={[points, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color={target}
        transparent
        opacity={0.85}
        roughness={0.1}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

interface HoleProps {
  y3D: number;
}

function Hole({ y3D }: HoleProps) {
  const rx = 2.0 + Math.sin((y3D / 8) * Math.PI) * 0.4;
  return (
    <mesh position={[rx + 0.05, y3D, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.2, 12]} />
      <meshStandardMaterial color="#1e293b" flatShading />
    </mesh>
  );
}

interface SpoutProps {
  y3D: number;
  realH: number;
  depth: number;
  density: number;
  colorHex: string;
}

function Spout({ y3D, realH, depth, density, colorHex }: SpoutProps) {
  const isActive = depth > realH;

  const curve = useMemo(() => {
    if (!isActive) return null;
    const P = density * 9.81 * (depth - realH) / 1000;
    const v = 0.6 * Math.sqrt(P); // Exaggerated visual velocity emphasizing pressure
    const rx = 2.0 + Math.sin((y3D / 8) * Math.PI) * 0.4;
    const g3D = 9.81;
    const pts = [];
    const steps = 20;
    const tMax = Math.sqrt(2 * y3D / g3D);

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax;
      const cx = rx + v * t;
      const cy = y3D - 0.5 * g3D * t * t;
      pts.push(new THREE.Vector3(cx, Math.max(cy, 0), 0));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, [isActive, depth, density, y3D, realH]);

  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useGSAP(() => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.color, {
      r: parseInt(colorHex.slice(1, 3), 16) / 255,
      g: parseInt(colorHex.slice(3, 5), 16) / 255,
      b: parseInt(colorHex.slice(5, 7), 16) / 255,
      duration: 0.6,
    });
  }, { dependencies: [colorHex] });

  if (!curve) return null;

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.08, 8, false]} />
      <meshStandardMaterial ref={materialRef} color={colorHex} transparent opacity={0.6} flatShading />
    </mesh>
  );
}

interface PressureLabelProps {
  y3D: number;
  realH: number;
  depth: number;
  density: number;
}

function PressureLabel({ y3D, realH, depth, density }: PressureLabelProps) {
  const isActive = depth > realH;
  const P = isActive ? (density * 9.81 * (depth - realH) / 1000) : 0;
  const rx = 2.0 + Math.sin((y3D / 8) * Math.PI) * 0.4;

  return (
    <group position={[rx + 0.4, y3D + 0.35, 0]}>
      <Text
        fontSize={0.25}
        color="#0f172a"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ffffff"
      >
        {`${P.toFixed(1)} kPa`}
      </Text>
    </group>
  );
}

export default function PressureDepthSim() {
  const depth = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues['depth'] ?? 10
  );
  const density = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues['density'] ?? 1000
  );

  const colors: Record<number, string> = {
    1000: '#3b82f6',
    1025: '#0ea5e9',
    850: '#ca8a04',
    13534: '#9ca3af',
  };
  const colorHex = colors[density] || '#3b82f6';

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#f4d58d" />

      {/* Barrel sits at y=0, on the global floor */}
      <group>
        <Barrel />
        <BarrelBand yStart={1.5} yEnd={2.2} />
        <BarrelBand yStart={5.8} yEnd={6.5} />
        <Fluid depth={depth} density={density} />

        {HOLES.map((hole, i) => (
          <group key={i}>
            <Hole y3D={hole.y3D} />
            <Spout
              y3D={hole.y3D}
              realH={hole.realH}
              depth={depth}
              density={density}
              colorHex={colorHex}
            />
            <PressureLabel
              y3D={hole.y3D}
              realH={hole.realH}
              depth={depth}
              density={density}
            />
          </group>
        ))}
      </group>
    </>
  );
}
