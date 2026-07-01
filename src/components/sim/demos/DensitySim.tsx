'use client';

import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSimStore } from '@/store/play/store';
import { Text } from '@react-three/drei';

gsap.registerPlugin(useGSAP);

export default function DensitySim() {
  const materialType = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['materialType'] ?? 'stone');
  const measurementType = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['measurementType'] ?? 'mass');

  // References for animation
  const stoneRef = useRef<THREE.Group>(null!);
  const woodRef = useRef<THREE.Group>(null!);
  const waterRef = useRef<THREE.Group>(null!);
  const beakerOilRef = useRef<THREE.Group>(null!);

  // Data for the readout
  const massData: Record<string, string> = {
    stone: '54.0 g',
    wood: '14.4 g',
    oil: '34.0 g (Tared)',
  };

  // The water level inside the cylinder (0 to 1 scaling factor)
  // Base 50mL = scale Y 1.0 (height 2)
  // Stone drop 70mL = scale Y 1.4 (height 2.8)
  const initialWaterScale = 1.0;
  const finalWaterScale = 1.4;

  useGSAP(() => {
    // Reset positions safely to standby locations on the back of the table
    if (stoneRef.current) gsap.set(stoneRef.current.position, { x: 0, y: 0.4, z: -2 }); 
    if (woodRef.current) gsap.set(woodRef.current.position, { x: 2, y: 0.5, z: -2 });
    if (waterRef.current) gsap.set(waterRef.current.scale, { y: initialWaterScale });
    if (beakerOilRef.current) gsap.set(beakerOilRef.current.scale, { y: 0 }); // Hide beaker oil

    // Logic based on state
    if (measurementType === 'mass') {
      if (materialType === 'stone' && stoneRef.current) {
        gsap.to(stoneRef.current.position, { x: -2.5, y: 0.6, z: 1, duration: 1, ease: 'power2.out' }); // On balance
      } else if (materialType === 'wood' && woodRef.current) {
        gsap.to(woodRef.current.position, { x: -2.5, y: 0.5, z: 1, duration: 1, ease: 'power2.out' }); // On balance
      } else if (materialType === 'oil' && beakerOilRef.current) {
        gsap.to(beakerOilRef.current.scale, { y: 1, duration: 1 }); // Fill beaker on balance
      }
    } else if (measurementType === 'volume') {
      if (materialType === 'stone' && stoneRef.current && waterRef.current) {
        // Drop stone in cylinder
        gsap.set(stoneRef.current.position, { x: 2.5, y: 4, z: 1 }); // Above cylinder
        gsap.to(stoneRef.current.position, { y: 0.3, duration: 1.5, ease: 'bounce.out', delay: 0.5 });
        gsap.to(waterRef.current.scale, { y: finalWaterScale, duration: 1.5, delay: 0.5, ease: 'power2.out' });
      } else if (materialType === 'wood' && woodRef.current) {
        // Move wood near the ruler
        gsap.to(woodRef.current.position, { x: 3.5, y: 0.5, z: 2, duration: 1, ease: 'power2.out' });
      }
    }
  }, [materialType, measurementType]);

  return (
    <group position={[0, -1, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* Workbench Table */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[12, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* ---- ELECTRONIC BALANCE (LEFT SIDE) ---- */}
      <group position={[-2.5, 0, 1]}>
        {/* Balance Base */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.2, 3]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Balance Pan (Top is at y=0.3) */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Digital Screen Area */}
        <mesh position={[0, 0.15, 1.6]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.5, 0.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Screen Text */}
        <Text 
          position={[0, 0.2, 1.65]} 
          rotation={[-Math.PI / 6, 0, 0]} 
          color="#10b981" 
          fontSize={0.25} 
        >
          {measurementType === 'mass' ? massData[materialType] : '0.0 g'}
        </Text>
      </group>

      {/* ---- MEASURING CYLINDER (RIGHT SIDE) ---- */}
      <group position={[2.5, 0, 1]}>
        {/* Glass Cylinder (No solid shadow) */}
        <mesh position={[0, 2, 0]} receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 4, 32]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Base (No solid shadow, shifted up by 0.001 to prevent Z-fighting) */}
        <mesh position={[0, 0.101, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        
        {/* Water inside Cylinder */}
        <group position={[0, 0.2, 0]} visible={materialType === 'stone' || (materialType === 'wood' && measurementType !== 'mass')}>
          <group ref={waterRef} position={[0, 0, 0]}>
            <mesh position={[0, 1, 0]} receiveShadow>
              {/* Scale Y=1 means height=2 (50mL mark) */}
              <cylinderGeometry args={[0.78, 0.78, 2, 32]} />
              <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} roughness={0.1} />
            </mesh>
          </group>
        </group>
        
        {/* Oil inside Cylinder */}
        <group position={[0, 0.2, 0]} visible={materialType === 'oil' && measurementType === 'volume'}>
          <mesh position={[0, 0.8, 0]} receiveShadow>
            {/* 40mL mark (Scale Y=0.8 means height=1.6) */}
            <cylinderGeometry args={[0.78, 0.78, 1.6, 32]} />
            <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} roughness={0.1} />
          </mesh>
        </group>
        
        {/* Volume Markings */}
        <group position={[0, 0, 0.81]}>
          <Text position={[0, 0.2 + 0.8, 0]} fontSize={0.15} color="black">20mL</Text>
          <Text position={[0, 0.2 + 1.6, 0]} fontSize={0.15} color="black">40mL</Text>
          <Text position={[0, 0.2 + 2.0, 0]} fontSize={0.15} color="black">50mL</Text>
          <Text position={[0, 0.2 + 2.8, 0]} fontSize={0.15} color="red">70mL</Text>
          <Text position={[0, 0.2 + 3.2, 0]} fontSize={0.15} color="black">80mL</Text>
        </group>
      </group>

      {/* ---- BEAKER FOR OIL MASS (ON BALANCE) ---- */}
      {/* Shifted up to 0.301 to prevent Z-fighting with balance pan at 0.3 */}
      <group position={[-2.5, 0.301, 1]} visible={materialType === 'oil' && measurementType === 'mass'}>
        {/* Beaker Glass (No solid shadow) */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 1, 32]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Oil inside Beaker */}
        <group ref={beakerOilRef} position={[0, 0.1, 0]}>
          <mesh position={[0, 0.4, 0]} receiveShadow>
            <cylinderGeometry args={[0.58, 0.58, 0.8, 32]} />
            <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ---- STONE (Irregular Solid) ---- */}
      <group ref={stoneRef}>
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      </group>

      {/* ---- WOOD BLOCK (Regular Solid) ---- */}
      <group ref={woodRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1, 1.5]} /> {/* 4cm x 2cm x 3cm scaled down by half */}
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
      </group>

      {/* ---- 3D RULER (For Wood Volume) ---- */}
      <group position={[3.5, 0.05, 2]} visible={materialType === 'wood' && measurementType === 'volume'}>
        <mesh castShadow receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <boxGeometry args={[4, 0.4, 0.05]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <Text position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.15} color="black">
          | | | | | | | | | |{'\n'}
          0 1 2 3 4 5 6 7 8 9 10
        </Text>
      </group>

    </group>
  );
}
