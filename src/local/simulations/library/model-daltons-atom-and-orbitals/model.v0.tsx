'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './index';

export default function DaltonsAtomModel() {
  const atomModel = useSimValue<IValueMap, 'atom_model'>('atom_model', "Dalton's Sphere");
  const orbitalView = useSimValue<IValueMap, 'orbital_view'>('orbital_view', '1s Orbital');
  const showLabels = useSimValue<IValueMap, 'show_labels'>('show_labels', false);

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

      {/* Vector SDF Quantum Badge Label */}
      {showLabels && <QuantumLabels orbitalView={orbitalView} atomModel={atomModel} />}
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
      {/* Primary Solid Billiard Ball Atom */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Equatorial Atomic Equator Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.53, 0.008, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
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
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#ec4899"
          transparent
          opacity={0.6}
          transmission={0.6}
          roughness={0.2}
        />
      </mesh>

      {electronPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.065, 32, 32]} />
          <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.8} />
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

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 3.0;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 2.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 2.0;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Clustered Protons & Neutrons Nucleus */}
      <group position={[0, 0, 0]}>
        <mesh position={[0.04, 0.04, 0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[-0.05, 0.03, -0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0.03, -0.05, 0.04]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[-0.04, -0.04, -0.03]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0.01, 0.06, -0.02]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0.05, -0.02, -0.05]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[-0.02, 0.05, 0.05]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial color="#10b981" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>

      {/* Ring 1 */}
      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[0.65, 0.01, 16, 100]} />
          <meshStandardMaterial color="#6366f1" roughness={0.3} />
        </mesh>
        <group ref={ring1Ref}>
          <mesh position={[0.65, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
          <mesh position={[-0.65, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
        </group>
      </group>

      {/* Ring 2 */}
      <group rotation={[-Math.PI / 4, -Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[0.82, 0.01, 16, 100]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.3} />
        </mesh>
        <group ref={ring2Ref}>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, -0.82, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
        </group>
      </group>

      {/* Ring 3 */}
      <group rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[0.98, 0.01, 16, 100]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.3} />
        </mesh>
        <group ref={ring3Ref}>
          <mesh position={[0.98, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
          </mesh>
          <mesh position={[-0.98, 0, 0]}>
            <sphereGeometry args={[0.055, 32, 32]} />
            <meshPhysicalMaterial color="#eab308" metalness={0.9} roughness={0.1} clearcoat={1.0} />
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
      <mesh>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transparent
          opacity={0.65}
          transmission={0.6}
          roughness={0.15}
        />
      </mesh>

      {is2s && (
        <mesh>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial
            color="#6366f1"
            transparent
            opacity={0.3}
            transmission={0.8}
            roughness={0.1}
            wireframe
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
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.8}
        transmission={0.6}
        roughness={0.15}
        clearcoat={0.8}
        ior={1.35}
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
      {/* Upper Lobe (+Y) */}
      <group position={[0, 0.04, 0]}>
        <TeardropLobe color="#f59e0b" />
      </group>

      {/* Lower Lobe (-Y) */}
      <group position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
        <TeardropLobe color="#f59e0b" />
      </group>

      {/* Central Nodal Point Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * Crisp Vector SDF Quantum Number Badge
 */
function QuantumLabels({ orbitalView, atomModel }: { orbitalView: string; atomModel: string }) {
  const getQuantumText = () => {
    switch (orbitalView) {
      case '1s Orbital':
        return '1s Orbital (n=1, l=0, ml=0)';
      case '2s Orbital':
        return '2s Orbital (n=2, l=0, ml=0)';
      case '2px Orbital':
        return '2px Orbital (n=2, l=1, ml=-1)';
      case '2py Orbital':
        return '2py Orbital (n=2, l=1, ml=0)';
      case '2pz Orbital':
        return '2pz Orbital (n=2, l=1, ml=+1)';
      default:
        return `${atomModel}`;
    }
  };

  return (
    <group position={[-1.1, 0, 0]}>
      <Text
        fontSize={0.095}
        color="#0f172a"
        anchorX="right"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#ffffff"
      >
        {getQuantumText()}
      </Text>
    </group>
  );
}
