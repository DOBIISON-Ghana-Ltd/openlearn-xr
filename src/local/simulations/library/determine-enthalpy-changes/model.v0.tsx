'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v0';

export default function EnthalpyChangesModel() {
  const reactionType = useSimValue<IValueMap, 'reaction_type'>('reaction_type', 'Neutralization (HCl + NaOH)');
  const reactantAmount = useSimValue<IValueMap, 'reactant_amount'>('reactant_amount', 50);
  const initiateReaction = useSimValue<IValueMap, 'initiate_reaction'>('initiate_reaction', false);

  // Dynamic temperature state (in °C)
  const [currentTemp, setCurrentTemp] = useState<number>(25.0);
  const tempRef = useRef<number>(25.0);
  const stirrerGroupRef = useRef<THREE.Group>(null);
  const fluidMeshRef = useRef<THREE.Mesh>(null);

  // Calculate target final temperature based on reaction type & mass amount
  const { targetDeltaT, isExothermic } = useMemo(() => {
    let deltaT = 0;
    let exo = true;

    if (reactionType === 'Neutralization (HCl + NaOH)') {
      deltaT = 0.35 * reactantAmount; // e.g. +17.5°C at 50g -> 42.5°C
      exo = true;
    } else if (reactionType === 'Solution (NH4Cl - Endothermic)') {
      deltaT = -0.22 * reactantAmount; // e.g. -11.0°C at 50g -> 14.0°C
      exo = false;
    } else if (reactionType === 'Solution (CaCl2 - Exothermic)') {
      deltaT = 0.28 * reactantAmount; // e.g. +14.0°C at 50g -> 39.0°C
      exo = true;
    }

    return { targetDeltaT: deltaT, isExothermic: exo };
  }, [reactionType, reactantAmount]);

  const targetTemp = initiateReaction ? 25.0 + targetDeltaT : 25.0;

  // Continuous physics & kinetics animation loop
  useFrame((state, delta) => {
    // 1. Smooth thermal relaxation damping towards targetTemp
    const newTemp = THREE.MathUtils.damp(tempRef.current, targetTemp, 1.8, delta);
    tempRef.current = newTemp;
    setCurrentTemp(newTemp);

    // 2. Continuous stirring rod rotation when active
    if (stirrerGroupRef.current && initiateReaction) {
      stirrerGroupRef.current.rotation.y += delta * 4.5;
      stirrerGroupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 8.0) * 0.008;
    }

    // 3. Subtle liquid surface ripple animation
    if (fluidMeshRef.current && initiateReaction) {
      fluidMeshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 3.0) * 0.05;
    }
  });

  // Calculate enthalpy heat change q = m * c * deltaT (in Joules)
  const deltaT = currentTemp - 25.0;
  const massGrams = reactantAmount; // 1 mL ≈ 1 g
  const heatCapacity = 4.18; // J/(g·°C)
  const heatJoules = massGrams * heatCapacity * deltaT;
  const heatKJ = heatJoules / 1000;

  // Fluid height based on volume/mass
  const fluidHeight = 0.08 + 0.20 * (reactantAmount / 100);

  return (
    <group position={[0, 0, 0]}>
      {/* Central Calorimeter Apparatus */}
      <group position={[-0.35, 0, 0]}>
        {/* Outer Styrofoam Insulated Wall */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.36, 0.34, 0.44, 48]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.05} />
        </mesh>

        {/* Inner Chamber Glass / Metal Liner */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.30, 0.30, 0.42, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.35}
            transmission={0.4}
          />
        </mesh>

        {/* Reaction Fluid Liquid */}
        <ReactionFluid
          fluidMeshRef={fluidMeshRef}
          height={fluidHeight}
          currentTemp={currentTemp}
          isExothermic={isExothermic}
          initiateReaction={initiateReaction}
        />

        {/* Insulated Lid with Openings */}
        <CalorimeterLid />

        {/* Rotating Stainless Steel Stirring Rod */}
        <group ref={stirrerGroupRef} position={[0.08, 0.08, 0]}>
          <StirringRod />
        </group>

        {/* Digital Thermometer Probe & LCD Screen */}
        <DigitalThermometer currentTemp={currentTemp} deltaT={deltaT} />

        {/* Dynamic Thermal Particles / Effects */}
        {initiateReaction && (
          <ThermalEffects isExothermic={isExothermic} currentTemp={currentTemp} />
        )}
      </group>

      {/* Holographic Academic Laboratory HUD Data Screen */}
      <LaboratoryHUDPanel
        reactionType={reactionType}
        massGrams={massGrams}
        currentTemp={currentTemp}
        deltaT={deltaT}
        heatKJ={heatKJ}
        isExothermic={isExothermic}
        initiateReaction={initiateReaction}
      />
    </group>
  );
}

/**
 * Reaction Liquid Solution Component with Dynamic Thermal Color Glow
 */
function ReactionFluid({
  fluidMeshRef,
  height,
  currentTemp,
  isExothermic,
  initiateReaction,
}: {
  fluidMeshRef: React.RefObject<THREE.Mesh | null>;
  height: number;
  currentTemp: number;
  isExothermic: boolean;
  initiateReaction: boolean;
}) {
  const yPos = -0.32 + height / 2;

  // Dynamic fluid color interpolation
  const fluidColor = useMemo(() => {
    if (!initiateReaction) return '#0284c7'; // Neutral Sky Blue

    const delta = currentTemp - 25.0;
    if (isExothermic) {
      // Warm Amber to Intense Red
      const t = Math.min(1, Math.max(0, delta / 35.0));
      return new THREE.Color('#38bdf8').lerp(new THREE.Color('#ef4444'), t).getHexString();
    } else {
      // Cool Teal to Deep Ice Blue
      const t = Math.min(1, Math.max(0, -delta / 20.0));
      return new THREE.Color('#38bdf8').lerp(new THREE.Color('#06b6d4'), t).getHexString();
    }
  }, [currentTemp, isExothermic, initiateReaction]);

  return (
    <group position={[0, yPos, 0]}>
      <mesh ref={fluidMeshRef}>
        <cylinderGeometry args={[0.29, 0.29, height, 36]} />
        <meshPhysicalMaterial
          color={`#${fluidColor}`}
          roughness={0.1}
          transmission={0.65}
          transparent
          opacity={0.88}
          clearcoat={0.9}
        />
      </mesh>

      {/* Surface Liquid Rim */}
      <mesh position={[0, height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.29, 36]} />
        <meshBasicMaterial color={`#${fluidColor}`} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Insulated Calorimeter Lid Component
 */
function CalorimeterLid() {
  return (
    <group position={[0, 0.09, 0]}>
      {/* Primary Lid Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 48]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Lid Rim Ring */}
      <mesh position={[0, -0.025, 0]}>
        <torusGeometry args={[0.38, 0.012, 16, 64]} />
        <meshStandardMaterial color="#475569" roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Stainless Steel Stirring Rod Component
 */
function StirringRod() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Vertical Shaft */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.58, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Bottom Agitator Loop */}
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.01, 16, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Top Handle Loop */}
      <mesh position={[0, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.01, 16, 24]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Digital Thermometer Probe & LCD Screen Readout Component
 */
function DigitalThermometer({ currentTemp, deltaT }: { currentTemp: number; deltaT: number }) {
  // Height of thermal indicator column based on current temp (25°C = baseline)
  const columnHeight = Math.min(0.35, Math.max(0.05, 0.15 + (deltaT / 40.0) * 0.15));

  return (
    <group position={[-0.10, 0.12, 0]}>
      {/* Stainless Sensor Stem Probe */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.55, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Inner Thermal Fluid Sensor Column */}
      <mesh position={[0, -0.32 + columnHeight / 2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, columnHeight, 16]} />
        <meshBasicMaterial color={deltaT >= 0 ? '#ef4444' : '#06b6d4'} />
      </mesh>

      {/* Sensor Tip Bulb */}
      <mesh position={[0, -0.42, 0]}>
        <sphereGeometry args={[0.015, 24, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Digital LCD Screen Body Housing */}
      <group position={[0, 0.22, 0]}>
        {/* Main Body Casing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.14, 0.07]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* LED Backlight Screen Frame */}
        <mesh position={[0, 0, 0.036]}>
          <planeGeometry args={[0.18, 0.10]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>

        {/* Live Vector SDF Digital LED Readout */}
        <Text
          position={[0, 0.01, 0.038]}
          fontSize={0.052}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          {`${currentTemp.toFixed(1)}°C`}
        </Text>

        <Text
          position={[0, -0.03, 0.038]}
          fontSize={0.022}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {`ΔT: ${deltaT >= 0 ? '+' : ''}${deltaT.toFixed(1)}°C`}
        </Text>
      </group>
    </group>
  );
}

/**
 * Animated Thermal Effects (Exothermic Steam Ring / Endothermic Frost Glow)
 */
function ThermalEffects({ isExothermic, currentTemp }: { isExothermic: boolean; currentTemp: number }) {
  const effectRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (effectRef.current) {
      if (isExothermic) {
        effectRef.current.position.y = 0.12 + Math.sin(state.clock.getElapsedTime() * 4.0) * 0.02;
      } else {
        effectRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
      }
    }
  });

  if (isExothermic) {
    // Warm Heat Wave Ring Above Lid
    return (
      <group ref={effectRef} position={[0, 0.12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.02, 16, 48]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.45} />
        </mesh>
      </group>
    );
  } else {
    // Cool Cyan Frost Condensation Ring
    return (
      <group ref={effectRef} position={[0, 0.10, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.39, 0.015, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }
}

/**
 * Holographic Academic Laboratory HUD Data Screen
 */
function LaboratoryHUDPanel({
  reactionType,
  massGrams,
  currentTemp,
  deltaT,
  heatKJ,
  isExothermic,
  initiateReaction,
}: {
  reactionType: string;
  massGrams: number;
  currentTemp: number;
  deltaT: number;
  heatKJ: number;
  isExothermic: boolean;
  initiateReaction: boolean;
}) {
  const processLabel = isExothermic ? 'EXOTHERMIC (Heat Released)' : 'ENDOTHERMIC (Heat Absorbed)';
  const processColor = isExothermic ? '#ef4444' : '#06b6d4';

  return (
    <group position={[0.75, 0.05, 0]}>
      {/* Semi-transparent Holographic HUD Background */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.82, 0.65]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.75} />
      </mesh>

      {/* HUD Border Ring */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.82, 0.65)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </lineSegments>

      {/* Header Title */}
      <Text position={[0, 0.26, 0]} fontSize={0.045} color="#38bdf8" anchorX="center" anchorY="middle">
        CALORIMETRY DATA & KINETICS
      </Text>

      {/* Active Reaction */}
      <Text position={[-0.37, 0.18, 0]} fontSize={0.032} color="#f8fafc" anchorX="left" anchorY="middle">
        {`Reaction: ${reactionType.split(' ')[0]}`}
      </Text>

      {/* Status / Process Indicator */}
      <Text position={[-0.37, 0.11, 0]} fontSize={0.030} color={processColor} anchorX="left" anchorY="middle">
        {`Process: ${initiateReaction ? processLabel : 'IDLE (Awaiting Reaction)'}`}
      </Text>

      {/* Measurement Readouts */}
      <Text position={[-0.37, 0.03, 0]} fontSize={0.030} color="#cbd5e1" anchorX="left" anchorY="middle">
        {`Initial Temp (T_i):  25.0 °C`}
      </Text>

      <Text position={[-0.37, -0.04, 0]} fontSize={0.030} color="#ffffff" anchorX="left" anchorY="middle">
        {`Current Temp (T):  ${currentTemp.toFixed(1)} °C`}
      </Text>

      <Text position={[-0.37, -0.11, 0]} fontSize={0.030} color={deltaT >= 0 ? '#f97316' : '#38bdf8'} anchorX="left" anchorY="middle">
        {`Temp Change (ΔT):  ${deltaT >= 0 ? '+' : ''}${deltaT.toFixed(1)} °C`}
      </Text>

      <Text position={[-0.37, -0.18, 0]} fontSize={0.030} color="#cbd5e1" anchorX="left" anchorY="middle">
        {`Reactant Mass (m):  ${massGrams.toFixed(0)} g (mL)`}
      </Text>

      {/* Formula & Calculated Heat Transfer */}
      <Text position={[-0.37, -0.26, 0]} fontSize={0.034} color="#facc15" anchorX="left" anchorY="middle">
        {`q = m · c · ΔT = ${heatKJ.toFixed(2)} kJ`}
      </Text>
    </group>
  );
}

