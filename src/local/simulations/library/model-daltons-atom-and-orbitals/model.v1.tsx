'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v1';

export default function DaltonsAtomModelV1() {
  const atomModel = useSimValue<IValueMap, 'atom_model'>('atom_model', "Dalton's Sphere");
  const orbitalView = useSimValue<IValueMap, 'orbital_view'>('orbital_view', '1s Orbital');

  const modelGroupRef = useRef<THREE.Group>(null);

  // Subtle continuous rotation for dynamic academic presentation
  useFrame((_, delta) => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Floating Center Atomic & Orbital Scene with Drop-in Animation */}
      <ModelTransition activeKey={`${atomModel}-${orbitalView}`}>
        <group ref={modelGroupRef} position={[0, 0, 0]}>
          {/* Historical Atomic Models */}
          {atomModel === "Dalton's Sphere" && <DaltonsSphere />}
          {atomModel === "Thompson's Model" && <ThompsonsModel />}
          {atomModel === "Rutherford's Model" && <RutherfordsModel />}

          {/* Quantum Orbital Visualizers */}
          {(orbitalView === '1s Orbital' || orbitalView === '2s Orbital') && (
            <SOrbital view={orbitalView} />
          )}
          {(orbitalView === '2px Orbital' || orbitalView === '2py Orbital' || orbitalView === '2pz Orbital') && (
            <POrbital view={orbitalView} />
          )}
        </group>
      </ModelTransition>
    </group>
  );
}

/**
 * Smooth 3D Transition Component
 * Drops incoming model down from top (y = 0.9 -> 0) with smooth cubic ease-out
 */
function ModelTransition({ activeKey, children }: { activeKey: string; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const prevKeyRef = useRef<string>(activeKey);
  const progressRef = useRef<number>(1);

  useEffect(() => {
    if (prevKeyRef.current !== activeKey) {
      prevKeyRef.current = activeKey;
      progressRef.current = 0;
      if (groupRef.current) {
        groupRef.current.position.y = 0.9; // Start at top above scene
      }
    }
  }, [activeKey]);

  useFrame((_, delta) => {
    if (groupRef.current && progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 2.8);
      // Cubic ease-out curve for natural drop & settle
      const t = progressRef.current;
      const easeOut = 1 - Math.pow(1 - t, 3);
      groupRef.current.position.y = 0.9 * (1 - easeOut);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * 1. Dalton's Solid Sphere Model (1803)
 * Historically proposed by John Dalton as an indivisible "billiard ball" sphere with no internal structure.
 * Enhanced with subtle atomic surface grid and floating 3D historical label.
 */
function DaltonsSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Gentle breathing pulse animation to make the solid sphere feel alive
  useFrame((state) => {
    if (sphereRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Solid Matte Clay Atom — soft periwinkle */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <meshStandardMaterial
          color="#7eb8e8"
          roughness={1.0}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

/**
 * 2. Thompson's Plum Pudding Model (1897)
 */
function ThompsonsModel() {
  const electronPositions: [number, number, number][] = [
    [0.25, 0.18, 0.18],
    [-0.22, -0.22, 0.18],
    [0.1, -0.18, -0.25],
    [-0.25, 0.18, -0.1],
    [0.18, 0.25, -0.18],
    [-0.1, -0.1, 0.28],
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Matte clay pudding sphere — soft rose */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          color="#e8a0b4"
          roughness={1.0}
          metalness={0}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Embedded matte clay electrons — warm yellow */}
      {electronPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.065, 32, 32]} />
          <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 3. Rutherford's Planetary Nuclear Model (1911)
 * Packed nucleus + dynamic revolving electrons on 3 orbital rings
 */
function RutherfordsModel() {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 3.0;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 2.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 2.0;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Matte clay nucleus */}
      <group position={[0, 0, 0]}>
        {/* Protons — soft coral */}
        <mesh position={[0.04, 0.04, 0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#f4857a" roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[0.03, -0.05, 0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#f4857a" roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[0.01, 0.06, -0.02]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#f4857a" roughness={1.0} metalness={0} />
        </mesh>
        {/* Neutrons — soft slate blue */}
        <mesh position={[-0.05, 0.03, -0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#8eaed4" roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[-0.04, -0.04, -0.03]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#8eaed4" roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[0.05, -0.02, -0.05]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#8eaed4" roughness={1.0} metalness={0} />
        </mesh>
        {/* Neutron — soft sage */}
        <mesh position={[-0.02, 0.05, 0.05]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#a8c8a0" roughness={1.0} metalness={0} />
        </mesh>
      </group>

      {/* Orbit Ring 1 — soft lavender */}
      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[0.65, 0.008, 16, 100]} />
          <meshStandardMaterial color="#b8a8d8" roughness={1.0} metalness={0} />
        </mesh>
        <group ref={ring1Ref}>
          <mesh position={[0.65, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
          <mesh position={[-0.65, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
        </group>
      </group>

      {/* Orbit Ring 2 — soft periwinkle */}
      <group rotation={[-Math.PI / 4, -Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[0.82, 0.008, 16, 100]} />
          <meshStandardMaterial color="#9ab8e0" roughness={1.0} metalness={0} />
        </mesh>
        <group ref={ring2Ref}>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
          <mesh position={[0, -0.82, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
        </group>
      </group>

      {/* Orbit Ring 3 — soft mint */}
      <group rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[0.98, 0.008, 16, 100]} />
          <meshStandardMaterial color="#90c8b8" roughness={1.0} metalness={0} />
        </mesh>
        <group ref={ring3Ref}>
          <mesh position={[0.98, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
          <mesh position={[-0.98, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshStandardMaterial color="#f5d48a" roughness={1.0} metalness={0} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Spherical s-Orbitals (1s & 2s)
 */
function SOrbital({ view }: { view: string }) {
  const is2s = view === '2s Orbital';

  return (
    <group position={[0, 0, 0]}>
      {/* Inner shell — soft sky blue clay */}
      <mesh>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial
          color="#a8cce8"
          roughness={1.0}
          metalness={0}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Outer 2s node shell — soft violet clay */}
      {is2s && (
        <mesh>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial
            color="#c0b0dc"
            roughness={1.0}
            metalness={0}
            transparent
            opacity={0.22}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Teardrop Lobe Component built via SvgLathe
 */
function TeardropLobe({ color }: { color: string }) {
  const balloonSvgPath = 'M 0 0 C 0.38 -0.15 0.4 -0.55 0 -0.75';

  return (
    <SvgLathe pathData={balloonSvgPath} segments={48} subdivisions={36}>
      <meshStandardMaterial
        color={color}
        roughness={1.0}
        metalness={0}
        transparent
        opacity={0.82}
      />
    </SvgLathe>
  );
}

/**
 * Dumbbell p-Orbitals (2px, 2py, 2pz)
 */
function POrbital({ view }: { view: string }) {
  let rotation: [number, number, number] = [0, 0, 0]; // 2py
  if (view === '2px Orbital') {
    rotation = [0, 0, -Math.PI / 2]; // 2px
  } else if (view === '2pz Orbital') {
    rotation = [Math.PI / 2, 0, 0]; // 2pz
  }

  return (
    <group rotation={rotation} position={[0, 0, 0]}>
      {/* Upper Lobe (+Y) — warm peach */}
      <group position={[0, 0.04, 0]}>
        <TeardropLobe color="#f5c4a0" />
      </group>

      {/* Lower Lobe (-Y) — soft sage */}
      <group position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
        <TeardropLobe color="#a8c8a0" />
      </group>

      {/* Central Nodal Point — white clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#e8e8f0" roughness={1.0} metalness={0} />
      </mesh>
    </group>
  );
}

/**
 * QuantumLabelOverlay
 * Pure DOM component — reads from the same Zustand simStore.
 * Renders fixed to the left side of the viewport, completely immune
 * to OrbitControls rotation and panning.
 */
export function QuantumLabelOverlay() {
  const orbitalView = useSimValue<IValueMap, 'orbital_view'>('orbital_view', '1s Orbital');
  const atomModel = useSimValue<IValueMap, 'atom_model'>('atom_model', "Dalton's Sphere");
  const showLabels = useSimValue<IValueMap, 'show_labels'>('show_labels', false);

  if (!showLabels) return null;

  const getQuantumText = () => {
    switch (orbitalView) {
      case '1s Orbital':  return { n: 1, l: 0, ml: 0,  label: '1s' };
      case '2s Orbital':  return { n: 2, l: 0, ml: 0,  label: '2s' };
      case '2px Orbital': return { n: 2, l: 1, ml: -1, label: '2pₓ' };
      case '2py Orbital': return { n: 2, l: 1, ml: 0,  label: '2pᵧ' };
      case '2pz Orbital': return { n: 2, l: 1, ml: 1,  label: '2pᵩ' };
      default: return null;
    }
  };

  const qn = getQuantumText();

  return (
    <div
      style={{
        position: 'absolute',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 160,
      }}
    >
      {/* Model badge */}
      <div style={{
        background: 'rgba(244, 248, 255, 0.94)',
        border: '1px solid rgba(100, 160, 230, 0.35)',
        borderRadius: 14,
        padding: '14px 18px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ margin: 0, fontSize: 10, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Atomic Model
        </p>
        <p style={{ margin: '5px 0 0', fontSize: 17, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700, lineHeight: 1.2 }}>
          {atomModel}
        </p>
      </div>

      {/* Quantum numbers badge */}
      {qn && (
        <div style={{
          background: 'rgba(244, 248, 255, 0.94)',
          border: '1px solid rgba(100, 160, 230, 0.35)',
          borderRadius: 14,
          padding: '14px 18px',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ margin: 0, fontSize: 10, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Orbital
          </p>
          <p style={{ margin: '5px 0 10px', fontSize: 28, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 800, lineHeight: 1 }}>
            {qn.label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { sym: 'n',  val: qn.n,  title: 'Principal' },
              { sym: 'ℓ',  val: qn.l,  title: 'Azimuthal' },
              { sym: 'mℓ', val: qn.ml >= 0 ? `+${qn.ml}` : qn.ml, title: 'Magnetic' },
            ].map(({ sym, val, title }) => (
              <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: '#8ab0d0', fontFamily: 'system-ui', fontWeight: 600, width: 24, flexShrink: 0 }}>{sym}</span>
                <span style={{ fontSize: 16, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700, width: 22 }}>{val}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'system-ui' }}>{title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
