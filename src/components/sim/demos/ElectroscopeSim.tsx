'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSimStore } from '@/store/play/store';
import { Text } from '@react-three/drei';

gsap.registerPlugin(useGSAP);

export default function ElectroscopeSim() {
  const id = 'hIen1m3rd4SY44a2mGGsQ'; // Must match sims.ts
  const rodType = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['rodType'] ?? 'glass');
  const rodChargeIntensity = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['rodCharge'] ?? 5);
  const rodDistance = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['rodDistance'] ?? 10);
  const isGrounded = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['isGrounded'] ?? false);
  const showCharges = useSimStore((s) => s.sessions[s.activeSessionId ?? '']?.controlValues['showCharges'] ?? true);

  // Permanent charge on the electroscope (conduction)
  const [electroscopeCharge, setElectroscopeCharge] = useState(0);

  // Rod charge: Positive for glass, negative for plastic.
  const currentRodCharge = rodType === 'glass' ? rodChargeIntensity : -rodChargeIntensity;

  useEffect(() => {
    if (isGrounded) {
      setElectroscopeCharge(0);
    } else if (rodDistance === 0) {
      // Conduction happens when rod touches cap (distance = 0)
      setElectroscopeCharge(currentRodCharge);
    }
  }, [rodDistance, isGrounded, currentRodCharge]);

  // Induced charge separation happens when a charged rod is near.
  // The bottom of the electroscope gets the SAME sign as the rod, as opposites are attracted to the cap.
  const inducedBottomCharge = isGrounded ? 0 : currentRodCharge * (1 / (1 + rodDistance * 0.5));
  
  // The total charge at the bottom (plate & leaf) determines deflection.
  const netBottomCharge = electroscopeCharge + inducedBottomCharge;

  // Deflection angle (0 to ~80 degrees max)
  const maxAngle = Math.PI / 2.2;
  const angle = Math.min(Math.abs(netBottomCharge) * 0.15, maxAngle);

  const leafRef = useRef<THREE.Group>(null!);
  const rodMeshRef = useRef<THREE.Mesh>(null!);

  useGSAP(() => {
    if (leafRef.current) {
      // Rotate leaf around Z axis
      gsap.to(leafRef.current.rotation, {
        z: angle, 
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [angle]);

  useGSAP(() => {
    if (rodMeshRef.current) {
      // Cap is at Y = 4.8. 
      // Distance slider maps to Y offset. 0 distance means rod touches cap (Y=4.9)
      const yPos = 4.9 + rodDistance * 0.3;
      gsap.to(rodMeshRef.current.position, {
        y: yPos,
        duration: 0.1,
      });
    }
  }, [rodDistance]);

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

      {/* Table / Base */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.5, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Glass Bell Jar */}
      <mesh position={[0, 2.5, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 4, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} roughness={0.1} metalness={0.1} side={THREE.DoubleSide}/>
      </mesh>

      {/* Rubber Stopper */}
      <mesh position={[0, 4.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>

      {/* Brass Cap */}
      <mesh position={[0, 4.8, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#b5a642" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Central Brass Rod */}
      <mesh position={[0, 3.0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3.4, 16]} />
        <meshStandardMaterial color="#b5a642" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Rigid Brass Plate (Bottom) */}
      <mesh position={[0, 1.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 1.5, 0.05]} />
        <meshStandardMaterial color="#b5a642" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Hinged Gold Leaf */}
      <group position={[0, 1.75, 0.05]} ref={leafRef}>
        <mesh position={[0, -0.75, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.5, 1.5, 0.01]} />
          <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Test Rod */}
      <mesh ref={rodMeshRef} position={[0, 7.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial 
          color={rodType === 'glass' ? '#a8d8ea' : '#1a202c'} 
          transparent={rodType === 'glass'} 
          opacity={rodType === 'glass' ? 0.6 : 1}
          roughness={0.1} 
        />
        {/* Rod Charge Indicator */}
        {showCharges && rodChargeIntensity > 0 && (
          <Text 
            position={[0, 0, 0.3]} 
            rotation={[0, 0, -Math.PI / 2]} // Keep text upright
            color={currentRodCharge > 0 ? '#ef4444' : '#3b82f6'} 
            fontSize={0.8} 
            outlineWidth={0.05} 
            outlineColor="white"
          >
            {currentRodCharge > 0 ? '+' : '-'}
          </Text>
        )}
      </mesh>

      {/* Ground Wire (Visible if grounded) */}
      {isGrounded && (
        <mesh position={[1, 4.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      )}

      {/* Bottom Charge Particles (Visualizing the Net Bottom Charge) */}
      {showCharges && Math.abs(netBottomCharge) > 0.5 && (
        <group position={[0, 1, 0.3]}>
          <Text color={netBottomCharge > 0 ? '#ef4444' : '#3b82f6'} fontSize={0.6} outlineWidth={0.05} outlineColor="white">
            {netBottomCharge > 0 ? '+' : '-'}
          </Text>
        </group>
      )}
      
      {/* Cap Charge Particles */}
      {showCharges && Math.abs(currentRodCharge) > 0 && rodDistance < 10 && !isGrounded && (
        <group position={[0, 4.8, 0.9]}>
          {/* If the bottom has the same charge as the rod (induced), the cap has the opposite charge! */}
          {/* Unless it was touched (conduction), in which case the whole electroscope has the same charge. */}
          <Text color={electroscopeCharge !== 0 ? (electroscopeCharge > 0 ? '#ef4444' : '#3b82f6') : (currentRodCharge < 0 ? '#ef4444' : '#3b82f6')} fontSize={0.6} outlineWidth={0.05} outlineColor="white">
            {electroscopeCharge !== 0 ? (electroscopeCharge > 0 ? '+' : '-') : (currentRodCharge < 0 ? '+' : '-')}
          </Text>
        </group>
      )}
    </group>
  );
}
