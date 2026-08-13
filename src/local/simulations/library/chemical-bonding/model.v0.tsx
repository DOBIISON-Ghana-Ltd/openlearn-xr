'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './index';

export default function ChemicalBondingModel() {
  const selectedMolecule = useSimValue<IValueMap, 'select_molecule'>('select_molecule', 'CH4 (Tetrahedral)');
  const showHybridOrbitals = useSimValue<IValueMap, 'show_hybrid_orbitals'>('show_hybrid_orbitals', false);
  const displayBondAngles = useSimValue<IValueMap, 'display_bond_angles'>('display_bond_angles', true);

  const modelGroupRef = useRef<THREE.Group>(null);

  // Subtle continuous rotation for dynamic academic presentation
  useFrame((_, delta) => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Floating Center Chemistry Scene with Smooth Transition */}
      <ModelTransition activeKey={selectedMolecule}>
        <group ref={modelGroupRef} position={[0, 0, 0]}>
          {selectedMolecule === 'BeCl2 (Linear)' && (
            <BeCl2Molecule showHybrid={showHybridOrbitals} showAngles={displayBondAngles} />
          )}
          {selectedMolecule === 'BCl3 (Trigonal Planar)' && (
            <BCl3Molecule showHybrid={showHybridOrbitals} showAngles={displayBondAngles} />
          )}
          {selectedMolecule === 'CH4 (Tetrahedral)' && (
            <CH4Molecule showHybrid={showHybridOrbitals} showAngles={displayBondAngles} />
          )}
          {selectedMolecule === 'PCl5 (Trigonal Bipyramidal)' && (
            <PCl5Molecule showHybrid={showHybridOrbitals} showAngles={displayBondAngles} />
          )}
          {selectedMolecule === 'SF6 (Octahedral)' && (
            <SF6Molecule showHybrid={showHybridOrbitals} showAngles={displayBondAngles} />
          )}
        </group>
      </ModelTransition>

      {/* Vector SDF Hybridization Badge */}
      <HybridizationBadge selectedMolecule={selectedMolecule} showHybrid={showHybridOrbitals} />
    </group>
  );
}

/**
 * Smooth 3D Transition Component
 * Drops incoming model down with smooth cubic ease-out
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
        groupRef.current.position.y = 0.8;
      }
    }
  }, [activeKey]);

  useFrame((_, delta) => {
    if (groupRef.current && progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 2.8);
      const t = progressRef.current;
      const easeOut = 1 - Math.pow(1 - t, 3);
      groupRef.current.position.y = 0.8 * (1 - easeOut);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}



/**
 * Teardrop Hybrid Lobe Mesh
 */
function TeardropLobe({ color }: { color: string }) {
  const balloonSvgPath = 'M 0 0 C 0.38 -0.15 0.4 -0.55 0 -0.75';

  return (
    <SvgLathe pathData={balloonSvgPath} segments={48} subdivisions={36}>
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.68}
        transmission={0.5}
        roughness={0.15}
        clearcoat={0.8}
        ior={1.35}
      />
    </SvgLathe>
  );
}

/**
 * Orientable Hybrid Lobe Component
 */
function HybridLobe({ dir, color = '#8b5cf6' }: { dir: [number, number, number]; color?: string }) {
  const direction = useMemo(() => new THREE.Vector3(...dir).normalize(), [dir]);
  const orientation = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, -1, 0), direction);
    return q;
  }, [direction]);

  return (
    <group quaternion={orientation} scale={[0.82, 0.82, 0.82]}>
      <TeardropLobe color={color} />
    </group>
  );
}

/**
 * 3D Bond Cylinder Component
 */
function BondCylinder({
  start = [0, 0, 0],
  end,
  radius = 0.035,
  color = '#e2e8f0',
}: {
  start?: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
}) {
  const { midPoint, orientation, length } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(endVec, startVec);
    const len = dir.length();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { midPoint: mid, orientation: q, length: len };
  }, [start, end]);

  return (
    <mesh position={midPoint.toArray()} quaternion={orientation}>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} transparent opacity={0.85} />
    </mesh>
  );
}

/**
 * 3D Bond Angle Vector Arc + SDF Label
 */
function BondAngleArc({
  vec1,
  vec2,
  label,
  radius = 0.38,
  color = '#38bdf8',
}: {
  vec1: [number, number, number];
  vec2: [number, number, number];
  label: string;
  radius?: number;
  color?: string;
}) {
  const { curve, midPoint } = useMemo(() => {
    const v1 = new THREE.Vector3(...vec1).normalize();
    const v2 = new THREE.Vector3(...vec2).normalize();

    const dot = Math.min(1, Math.max(-1, v1.dot(v2)));
    const angle = Math.acos(dot);

    let normal = new THREE.Vector3().crossVectors(v1, v2);
    if (normal.lengthSq() < 0.0001) {
      normal = new THREE.Vector3(0, 0, 1).cross(v1);
      if (normal.lengthSq() < 0.0001) {
        normal = new THREE.Vector3(0, 1, 0).cross(v1);
      }
    }
    normal.normalize();

    const vPerp = new THREE.Vector3().crossVectors(normal, v1).normalize();

    const points: THREE.Vector3[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * angle;
      const pt = new THREE.Vector3()
        .addScaledVector(v1, Math.cos(t) * radius)
        .addScaledVector(vPerp, Math.sin(t) * radius);
      points.push(pt);
    }

    const c = new THREE.CatmullRomCurve3(points);
    const midT = angle / 2;
    const mid = new THREE.Vector3()
      .addScaledVector(v1, Math.cos(midT) * (radius + 0.08))
      .addScaledVector(vPerp, Math.sin(midT) * (radius + 0.08));

    return { curve: c, midPoint: mid };
  }, [vec1, vec2, radius]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 32, 0.007, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      <Text
        position={midPoint.toArray()}
        fontSize={0.085}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#ffffff"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * 1. BeCl2 (Linear, sp)
 */
function BeCl2Molecule({ showHybrid, showAngles }: { showHybrid: boolean; showAngles: boolean }) {
  const cl1: [number, number, number] = [0.65, 0, 0];
  const cl2: [number, number, number] = [-0.65, 0, 0];

  return (
    <group position={[0, 0, 0]}>
      {/* Central Be Atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.2} metalness={0.8} clearcoat={1.0} />
      </mesh>

      {/* Terminal Cl Atoms */}
      <mesh position={cl1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={cl2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={cl1} />
      <BondCylinder end={cl2} />

      {/* Hybrid Orbitals (sp) */}
      {showHybrid && (
        <>
          <HybridLobe dir={cl1} color="#a855f7" />
          <HybridLobe dir={cl2} color="#a855f7" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={cl1} vec2={cl2} label="180°" radius={0.35} color="#0284c7" />}
    </group>
  );
}

/**
 * 2. BCl3 (Trigonal Planar, sp2)
 */
function BCl3Molecule({ showHybrid, showAngles }: { showHybrid: boolean; showAngles: boolean }) {
  const cl1: [number, number, number] = [0, 0.65, 0];
  const cl2: [number, number, number] = [-0.563, -0.325, 0];
  const cl3: [number, number, number] = [0.563, -0.325, 0];

  return (
    <group position={[0, 0, 0]}>
      {/* Central B Atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial color="#0d9488" roughness={0.15} metalness={0.4} clearcoat={1.0} />
      </mesh>

      {/* Terminal Cl Atoms */}
      <mesh position={cl1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={cl2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={cl3}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={cl1} />
      <BondCylinder end={cl2} />
      <BondCylinder end={cl3} />

      {/* Hybrid Orbitals (sp2) */}
      {showHybrid && (
        <>
          <HybridLobe dir={cl1} color="#06b6d4" />
          <HybridLobe dir={cl2} color="#06b6d4" />
          <HybridLobe dir={cl3} color="#06b6d4" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={cl1} vec2={cl3} label="120°" radius={0.36} color="#0284c7" />}
    </group>
  );
}

/**
 * 3. CH4 (Tetrahedral, sp3)
 */
function CH4Molecule({ showHybrid, showAngles }: { showHybrid: boolean; showAngles: boolean }) {
  const h1: [number, number, number] = [0, 0.65, 0];
  const h2: [number, number, number] = [0, -0.2167, 0.6128];
  const h3: [number, number, number] = [0.5307, -0.2167, -0.3064];
  const h4: [number, number, number] = [-0.5307, -0.2167, -0.3064];

  return (
    <group position={[0, 0, 0]}>
      {/* Central C Atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshPhysicalMaterial color="#334155" roughness={0.2} metalness={0.6} clearcoat={1.0} />
      </mesh>

      {/* Terminal H Atoms */}
      <mesh position={h1}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={h2}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={h3}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={h4}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={h1} radius={0.03} />
      <BondCylinder end={h2} radius={0.03} />
      <BondCylinder end={h3} radius={0.03} />
      <BondCylinder end={h4} radius={0.03} />

      {/* Hybrid Orbitals (sp3) */}
      {showHybrid && (
        <>
          <HybridLobe dir={h1} color="#8b5cf6" />
          <HybridLobe dir={h2} color="#8b5cf6" />
          <HybridLobe dir={h3} color="#8b5cf6" />
          <HybridLobe dir={h4} color="#8b5cf6" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={h1} vec2={h2} label="109.5°" radius={0.36} color="#0284c7" />}
    </group>
  );
}

/**
 * 4. PCl5 (Trigonal Bipyramidal, sp3d)
 */
function PCl5Molecule({ showHybrid, showAngles }: { showHybrid: boolean; showAngles: boolean }) {
  // Axial Cl atoms
  const clAx1: [number, number, number] = [0, 0.7, 0];
  const clAx2: [number, number, number] = [0, -0.7, 0];
  // Equatorial Cl atoms
  const clEq1: [number, number, number] = [0.65, 0, 0];
  const clEq2: [number, number, number] = [-0.325, 0, 0.563];
  const clEq3: [number, number, number] = [-0.325, 0, -0.563];

  return (
    <group position={[0, 0, 0]}>
      {/* Central P Atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshPhysicalMaterial color="#f97316" roughness={0.2} metalness={0.4} clearcoat={1.0} />
      </mesh>

      {/* Terminal Cl Atoms */}
      <mesh position={clAx1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={clAx2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={clEq1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={clEq2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={clEq3}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={clAx1} />
      <BondCylinder end={clAx2} />
      <BondCylinder end={clEq1} />
      <BondCylinder end={clEq2} />
      <BondCylinder end={clEq3} />

      {/* Hybrid Orbitals (sp3d) */}
      {showHybrid && (
        <>
          <HybridLobe dir={clAx1} color="#ec4899" />
          <HybridLobe dir={clAx2} color="#ec4899" />
          <HybridLobe dir={clEq1} color="#ec4899" />
          <HybridLobe dir={clEq2} color="#ec4899" />
          <HybridLobe dir={clEq3} color="#ec4899" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && (
        <>
          <BondAngleArc vec1={clAx1} vec2={clEq1} label="90°" radius={0.35} color="#0284c7" />
          <BondAngleArc vec1={clEq1} vec2={clEq2} label="120°" radius={0.38} color="#0284c7" />
        </>
      )}
    </group>
  );
}

/**
 * 5. SF6 (Octahedral, sp3d2)
 */
function SF6Molecule({ showHybrid, showAngles }: { showHybrid: boolean; showAngles: boolean }) {
  const f1: [number, number, number] = [0.65, 0, 0];
  const f2: [number, number, number] = [-0.65, 0, 0];
  const f3: [number, number, number] = [0, 0.65, 0];
  const f4: [number, number, number] = [0, -0.65, 0];
  const f5: [number, number, number] = [0, 0, 0.65];
  const f6: [number, number, number] = [0, 0, -0.65];

  return (
    <group position={[0, 0, 0]}>
      {/* Central S Atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshPhysicalMaterial color="#eab308" roughness={0.2} metalness={0.5} clearcoat={1.0} />
      </mesh>

      {/* Terminal F Atoms */}
      <mesh position={f1}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={f2}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={f3}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={f4}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={f5}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={f6}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={f1} />
      <BondCylinder end={f2} />
      <BondCylinder end={f3} />
      <BondCylinder end={f4} />
      <BondCylinder end={f5} />
      <BondCylinder end={f6} />

      {/* Hybrid Orbitals (sp3d2) */}
      {showHybrid && (
        <>
          <HybridLobe dir={f1} color="#e11d48" />
          <HybridLobe dir={f2} color="#e11d48" />
          <HybridLobe dir={f3} color="#e11d48" />
          <HybridLobe dir={f4} color="#e11d48" />
          <HybridLobe dir={f5} color="#e11d48" />
          <HybridLobe dir={f6} color="#e11d48" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={f3} vec2={f1} label="90°" radius={0.35} color="#0284c7" />}
    </group>
  );
}

/**
 * Crisp Vector SDF Hybridization Badge Component
 */
function HybridizationBadge({ selectedMolecule, showHybrid }: { selectedMolecule: string; showHybrid: boolean }) {
  const getBadgeText = () => {
    switch (selectedMolecule) {
      case 'BeCl2 (Linear)':
        return 'BeCl2: Linear Geometry (sp Hybridization)';
      case 'BCl3 (Trigonal Planar)':
        return 'BCl3: Trigonal Planar (sp2 Hybridization)';
      case 'CH4 (Tetrahedral)':
        return 'CH4: Tetrahedral (sp3 Hybridization)';
      case 'PCl5 (Trigonal Bipyramidal)':
        return 'PCl5: Trigonal Bipyramidal (sp3d Hybridization)';
      case 'SF6 (Octahedral)':
        return 'SF6: Octahedral (sp3d2 Hybridization)';
      default:
        return selectedMolecule;
    }
  };

  return (
    <group position={[-1.15, 0.9, 0]}>
      <Text
        fontSize={0.09}
        color="#0f172a"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#ffffff"
      >
        {getBadgeText()}
      </Text>
    </group>
  );
}

