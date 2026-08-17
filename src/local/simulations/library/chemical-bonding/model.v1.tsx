'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v1';

export default function ChemicalBondingModelV1() {
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
      <meshStandardMaterial
        color={color}
        roughness={1.0}
        metalness={0}
        transparent
        opacity={0.88}
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
  radius = 0.055,
  color = '#5a7080',
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
      <meshStandardMaterial color={color} roughness={0.8} metalness={0} />
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
  color = '#7aaec8',
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
      {/* Central Be — soft warm gray clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#9ab8c8" roughness={1.0} metalness={0} />
      </mesh>

      {/* Terminal Cl — muted sage green */}
      <mesh position={cl1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={cl2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={cl1} />
      <BondCylinder end={cl2} />

      {/* Hybrid Orbitals (sp) — soft lavender */}
      {showHybrid && (
        <>
          <HybridLobe dir={cl1} color="#c8a8f0" />
          <HybridLobe dir={cl2} color="#c8a8f0" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={cl1} vec2={cl2} label="180°" radius={0.35} color="#7aaec8" />}
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
      {/* Central B — soft muted teal clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#50c0b0" roughness={1.0} metalness={0} />
      </mesh>

      {/* Terminal Cl — muted sage green */}
      <mesh position={cl1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={cl2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={cl3}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={cl1} />
      <BondCylinder end={cl2} />
      <BondCylinder end={cl3} />

      {/* Hybrid Orbitals (sp2) — soft powder blue */}
      {showHybrid && (
        <>
          <HybridLobe dir={cl1} color="#80c8e0" />
          <HybridLobe dir={cl2} color="#80c8e0" />
          <HybridLobe dir={cl3} color="#80c8e0" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={cl1} vec2={cl3} label="120°" radius={0.36} color="#7aaec8" />}
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
      {/* Central C — soft slate clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#6888a0" roughness={1.0} metalness={0} />
      </mesh>

      {/* Terminal H — warm cream clay */}
      <mesh position={h1}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ece4d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={h2}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ece4d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={h3}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ece4d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={h4}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ece4d0" roughness={1.0} metalness={0} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={h1} radius={0.045} />
      <BondCylinder end={h2} radius={0.045} />
      <BondCylinder end={h3} radius={0.045} />
      <BondCylinder end={h4} radius={0.045} />

      {/* Hybrid Orbitals (sp3) — soft periwinkle */}
      {showHybrid && (
        <>
          <HybridLobe dir={h1} color="#9898e0" />
          <HybridLobe dir={h2} color="#9898e0" />
          <HybridLobe dir={h3} color="#9898e0" />
          <HybridLobe dir={h4} color="#9898e0" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={h1} vec2={h2} label="109.5°" radius={0.36} color="#7aaec8" />}
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
      {/* Central P — soft peach clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#e89060" roughness={1.0} metalness={0} />
      </mesh>

      {/* Terminal Cl — muted sage green */}
      <mesh position={clAx1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={clAx2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={clEq1}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={clEq2}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={clEq3}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#6ab87a" roughness={1.0} metalness={0} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={clAx1} />
      <BondCylinder end={clAx2} />
      <BondCylinder end={clEq1} />
      <BondCylinder end={clEq2} />
      <BondCylinder end={clEq3} />

      {/* Hybrid Orbitals (sp3d) — soft rose */}
      {showHybrid && (
        <>
          <HybridLobe dir={clAx1} color="#e888b0" />
          <HybridLobe dir={clAx2} color="#e888b0" />
          <HybridLobe dir={clEq1} color="#e888b0" />
          <HybridLobe dir={clEq2} color="#e888b0" />
          <HybridLobe dir={clEq3} color="#e888b0" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && (
        <>
          <BondAngleArc vec1={clAx1} vec2={clEq1} label="90°" radius={0.35} color="#7aaec8" />
          <BondAngleArc vec1={clEq1} vec2={clEq2} label="120°" radius={0.38} color="#7aaec8" />
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
      {/* Central S — soft muted yellow clay */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#c8b830" roughness={1.0} metalness={0} />
      </mesh>

      {/* Terminal F — soft powder blue clay */}
      <mesh position={f1}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={f2}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={f3}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={f4}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={f5}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>
      <mesh position={f6}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#58b0d0" roughness={1.0} metalness={0} />
      </mesh>

      {/* Bonds */}
      <BondCylinder end={f1} />
      <BondCylinder end={f2} />
      <BondCylinder end={f3} />
      <BondCylinder end={f4} />
      <BondCylinder end={f5} />
      <BondCylinder end={f6} />

      {/* Hybrid Orbitals (sp3d2) — soft salmon */}
      {showHybrid && (
        <>
          <HybridLobe dir={f1} color="#e07070" />
          <HybridLobe dir={f2} color="#e07070" />
          <HybridLobe dir={f3} color="#e07070" />
          <HybridLobe dir={f4} color="#e07070" />
          <HybridLobe dir={f5} color="#e07070" />
          <HybridLobe dir={f6} color="#e07070" />
        </>
      )}

      {/* Bond Angle Overlay */}
      {showAngles && <BondAngleArc vec1={f3} vec2={f1} label="90°" radius={0.35} color="#7aaec8" />}
    </group>
  );
}

/**
 * ChemicalBondingOverlay
 * Pure DOM component — reads from the same Zustand simStore.
 * Renders fixed to the left side of the viewport, completely immune
 * to OrbitControls rotation and panning.
 */
export function ChemicalBondingOverlay() {
  const selectedMolecule = useSimValue<IValueMap, 'select_molecule'>('select_molecule', 'CH4 (Tetrahedral)');
  const showHybridOrbitals = useSimValue<IValueMap, 'show_hybrid_orbitals'>('show_hybrid_orbitals', false);

  const MOLECULE_DATA: Record<string, { formula: string; geometry: string; hybridization: string; angles: string; color: string }> = {
    'BeCl2 (Linear)':            { formula: 'BeCl₂', geometry: 'Linear',             hybridization: 'sp',    angles: '180°',      color: '#a855f7' },
    'BCl3 (Trigonal Planar)':    { formula: 'BCl₃', geometry: 'Trigonal Planar',     hybridization: 'sp²',   angles: '120°',      color: '#06b6d4' },
    'CH4 (Tetrahedral)':         { formula: 'CH₄',  geometry: 'Tetrahedral',         hybridization: 'sp³',   angles: '109.5°',    color: '#8b5cf6' },
    'PCl5 (Trigonal Bipyramidal)':{ formula: 'PCl₅', geometry: 'Trigonal Bipyramidal',hybridization: 'sp³d',  angles: '90° / 120°', color: '#ec4899' },
    'SF6 (Octahedral)':          { formula: 'SF₆',  geometry: 'Octahedral',          hybridization: 'sp³d²', angles: '90°',       color: '#e11d48' },
  };

  const mol = MOLECULE_DATA[selectedMolecule];
  if (!mol) return null;

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
      {/* Formula + Geometry card */}
      <div style={{
        background: 'rgba(244, 248, 255, 0.94)',
        border: '1px solid rgba(100, 160, 230, 0.35)',
        borderRadius: 14,
        padding: '14px 18px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ margin: 0, fontSize: 10, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Molecule
        </p>
        <p style={{ margin: '5px 0 2px', fontSize: 28, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 800, lineHeight: 1 }}>
          {mol.formula}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4a6fa5', fontFamily: 'system-ui', fontWeight: 600 }}>
          {mol.geometry}
        </p>
      </div>

      {/* Hybridization + Angles card */}
      <div style={{
        background: 'rgba(244, 248, 255, 0.94)',
        border: '1px solid rgba(100, 160, 230, 0.35)',
        borderRadius: 14,
        padding: '14px 18px',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Hybridization
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 22, color: mol.color, fontFamily: 'system-ui', fontWeight: 800, lineHeight: 1 }}>
              {mol.hybridization}
            </p>
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(100, 160, 230, 0.2)' }} />
          <div>
            <p style={{ margin: 0, fontSize: 10, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Bond Angle
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 18, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
              {mol.angles}
            </p>
          </div>
        </div>
      </div>

      {/* Hybrid orbitals indicator */}
      {showHybridOrbitals && (
        <div style={{
          background: `rgba(${mol.color === '#a855f7' ? '168,85,247' : mol.color === '#06b6d4' ? '6,182,212' : mol.color === '#8b5cf6' ? '139,92,246' : mol.color === '#ec4899' ? '236,72,153' : '225,29,72'},0.12)`,
          border: `1px solid ${mol.color}40`,
          borderRadius: 14,
          padding: '10px 14px',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ margin: 0, fontSize: 11, color: mol.color, fontFamily: 'system-ui', fontWeight: 700 }}>
            ⬡ Hybrid orbitals visible
          </p>
        </div>
      )}
    </div>
  );
}
