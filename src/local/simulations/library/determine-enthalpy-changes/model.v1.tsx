'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSimValue } from '../../resolver';
import { IValueMap } from './index';

export default function EnthalpyChangesModelV1() {
  const reactionType = useSimValue<IValueMap, 'reaction_type'>('reaction_type', 'Neutralization (HCl + NaOH)');
  const reactantAmount = useSimValue<IValueMap, 'reactant_amount'>('reactant_amount', 50);
  const initiateReaction = useSimValue<IValueMap, 'initiate_reaction'>('initiate_reaction', false);
  const showHeatFlow = useSimValue<IValueMap, 'show_heat_flow'>('show_heat_flow', false);

  const [currentTemp, setCurrentTemp] = useState<number>(25.0);
  const tempRef = useRef<number>(25.0);
  const stirrerRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);

  const isCombustionMode = reactionType === 'Combustion (Ethanol Spirit Lamp)';

  // Calculate target delta T & thermodynamic characteristics
  const { targetDeltaT, isExothermic } = useMemo(() => {
    let deltaT = 0;
    let exo = true;

    if (reactionType === 'Neutralization (HCl + NaOH)') {
      deltaT = 0.35 * reactantAmount;
      exo = true;
    } else if (reactionType === 'Solution (NH4Cl - Endothermic)') {
      deltaT = -0.22 * reactantAmount;
      exo = false;
    } else if (reactionType === 'Solution (CaCl2 - Exothermic)') {
      deltaT = 0.28 * reactantAmount;
      exo = true;
    } else if (reactionType === 'Displacement (Zn + CuSO4)') {
      deltaT = 0.42 * reactantAmount;
      exo = true;
    } else if (reactionType === 'Combustion (Ethanol Spirit Lamp)') {
      deltaT = 0.50 * reactantAmount;
      exo = true;
    }

    return { targetDeltaT: deltaT, isExothermic: exo };
  }, [reactionType, reactantAmount]);

  const targetTemp = initiateReaction ? 25.0 + targetDeltaT : 25.0;

  // Continuous physics & thermal relaxation animation loop
  useFrame((state, delta) => {
    // 1. Damped thermal relaxation for temperature readout
    const newTemp = THREE.MathUtils.damp(tempRef.current, targetTemp, 1.8, delta);
    tempRef.current = newTemp;
    setCurrentTemp(newTemp);

    // 2. Stirrer animation - Maintain Y offset at 0.36
    if (stirrerRef.current && !isCombustionMode) {
      if (initiateReaction) {
        stirrerRef.current.rotation.y += delta * 4.5;
        stirrerRef.current.position.y = 0.36 + Math.sin(state.clock.getElapsedTime() * 6.0) * 0.005;
      } else {
        stirrerRef.current.position.y = 0.36;
      }
    }

    // 3. Flame flickering animation
    if (flameRef.current && initiateReaction && isCombustionMode) {
      const t = state.clock.getElapsedTime();
      flameRef.current.scale.set(
        1 + Math.sin(t * 12.0) * 0.08,
        1 + Math.cos(t * 15.0) * 0.12,
        1 + Math.sin(t * 10.0) * 0.08
      );
    }
  });

  const deltaT = currentTemp - 25.0;
  const massGrams = reactantAmount;
  const heatCapacity = 4.18; // J/(g·°C)
  const heatJoules = massGrams * heatCapacity * deltaT;
  const heatKJ = heatJoules / 1000;

  return (
    <group position={[0.10, -0.12, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Dynamic Academic Apparatus Stage */}
      {isCombustionMode ? (
        <CombustionCalorimeterSetup
          flameRef={flameRef}
          currentTemp={currentTemp}
          reactantAmount={reactantAmount}
          initiateReaction={initiateReaction}
        />
      ) : (
        <CoffeeCupCalorimeterSetup
          stirrerRef={stirrerRef}
          reactionType={reactionType}
          currentTemp={currentTemp}
          reactantAmount={reactantAmount}
          initiateReaction={initiateReaction}
          isExothermic={isExothermic}
        />
      )}

      {/* Emanating Gaseous Thermal Particles (ONLY when reaction is initiated and showHeatFlow is enabled) */}
      {initiateReaction && showHeatFlow && (
        <GaseousThermalParticles isExothermic={isExothermic} />
      )}

      {/* Clean Left-Side Floating Vector Text Readout */}
      <CleanLeftFloatingTextBadge
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
 * 1. Coffee-Cup Calorimeter Apparatus (Nested Polystyrene Cup inside Glass Beaker)
 */
function CoffeeCupCalorimeterSetup({
  stirrerRef,
  reactionType,
  currentTemp,
  reactantAmount,
  initiateReaction,
  isExothermic,
}: {
  stirrerRef: React.RefObject<THREE.Group | null>;
  reactionType: string;
  currentTemp: number;
  reactantAmount: number;
  initiateReaction: boolean;
  isExothermic: boolean;
}) {
  const fluidHeight = 0.10 + 0.16 * (reactantAmount / 100);
  const isDisplacement = reactionType === 'Displacement (Zn + CuSO4)';

  return (
    <group position={[0, -0.20, 0]}>
      {/* Outer 250mL Glass Beaker */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.20, 0.19, 0.36, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#e2e8f0"
            roughness={0.1}
            metalness={0.1}
            transmission={0.92}
            transparent
            opacity={0.45}
            ior={1.52}
            clearcoat={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Solid Base of Glass Beaker */}
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.01, 48]} />
          <meshPhysicalMaterial color="#cbd5e1" roughness={0.1} transmission={0.9} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Flared Glass Lip Rim */}
        <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.202, 0.008, 16, 64]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.95} transparent opacity={0.7} />
        </mesh>
        {/* Graduated Volume Ticks */}
        <BeakerGraduationTicks />
      </group>

      {/* Insulated Polystyrene Coffee Cup nested inside Beaker */}
      <group position={[0, 0.01, 0]}>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.175, 0.15, 0.33, 48]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.65} metalness={0.05} clearcoat={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Rolled Rim Lip of Styrofoam Cup */}
        <mesh position={[0, 0.335, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.177, 0.008, 16, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Reaction Liquid Solution inside Cup */}
        <CalorimeterLiquidSolution
          height={fluidHeight}
          currentTemp={currentTemp}
          isExothermic={isExothermic}
          isDisplacement={isDisplacement}
          initiateReaction={initiateReaction}
        />
      </group>

      {/* Insulated Dark Rubber Plug / Cork Lid */}
      <group position={[0, 0.35, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.17, 0.035, 48]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.181, 0.007, 16, 64]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>
      </group>

      {/* Stainless Loop Agitator Stirrer */}
      <group ref={stirrerRef} position={[0.06, 0.36, 0]}>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.32, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
        </mesh>

        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.045, 0.005, 16, 32]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
        </mesh>

        <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.022, 0.006, 16, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      {/* Precision Glass Thermometer with Integrated LED Screen Head */}
      <DigitalLabThermometer position={[-0.06, 0.36, 0]} currentTemp={currentTemp} deltaT={currentTemp - 25.0} />
    </group>
  );
}

/**
 * 2. Combustion Calorimeter Setup (Solid Double-Walled Copper Pot + Tripod Stand + Bunsen Burner)
 */
function CombustionCalorimeterSetup({
  flameRef,
  currentTemp,
  reactantAmount,
  initiateReaction,
}: {
  flameRef: React.RefObject<THREE.Group | null>;
  currentTemp: number;
  reactantAmount: number;
  initiateReaction: boolean;
}) {
  const waterHeight = 0.08 + 0.14 * (reactantAmount / 100);

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Laboratory Tripod Stand with Wire Gauze */}
      <TripodStand position={[0, 0.02, 0]} />

      {/* Portable Red Gas Canister Bunsen Burner */}
      <BunsenBurner position={[0, -0.32, 0]} flameRef={flameRef} initiateReaction={initiateReaction} />

      {/* Polished Solid Double-Walled Copper Can Calorimeter sitting on Wire Gauze at y = +0.022 */}
      <group position={[0, 0.022, 0]}>
        {/* Outer Copper Wall */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.135, 0.135, 0.24, 48, 1, true]} />
          <meshStandardMaterial color="#b45309" roughness={0.25} metalness={0.88} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Copper Wall */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.128, 0.128, 0.238, 48, 1, true]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Solid Base Disc */}
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.135, 0.135, 0.01, 48]} />
          <meshStandardMaterial color="#b45309" roughness={0.25} metalness={0.88} side={THREE.DoubleSide} />
        </mesh>
        {/* Rolled Top Metallic Rim Ring Connecting Inner & Outer Walls */}
        <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1315, 0.006, 16, 64]} />
          <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Water Inside Copper Can */}
        <mesh position={[0, 0.01 + waterHeight / 2, 0]}>
          <cylinderGeometry args={[0.127, 0.127, waterHeight, 36]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            roughness={0.1}
            transmission={0.7}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Suspended Precision Glass Thermometer (Positioned at Y = 0.16 so bulb is safely inside pot) */}
        <DigitalLabThermometer position={[0, 0.16, 0]} currentTemp={currentTemp} deltaT={currentTemp - 25.0} />
      </group>
    </group>
  );
}

/**
 * 3D Laboratory Tripod Stand (based on user reference image)
 */
function TripodStand({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const height = 0.34;
  const topRadius = 0.145;
  const botRadius = 0.185;

  const legs = useMemo(() => {
    return [0, 120, 240].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const topPt = new THREE.Vector3(topRadius * Math.cos(rad), 0.01, topRadius * Math.sin(rad));
      const botPt = new THREE.Vector3(botRadius * Math.cos(rad), -height + 0.01, botRadius * Math.sin(rad));

      const mid = new THREE.Vector3().addVectors(topPt, botPt).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(topPt, botPt);
      const len = dir.length();

      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

      return { mid, q, len, botPt };
    });
  }, [height, topRadius, botRadius]);

  return (
    <group position={position}>
      {/* 1. Flat Top Circular Cast Iron Ring Collar */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 48, 1, true]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner lip of top ring collar */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 48, 1, true]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Top flat washer face of ring collar */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.13, 0.16, 48]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Wire Gauze Disc sitting on Top Collar */}
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.155, 36]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} wireframe side={THREE.DoubleSide} />
      </mesh>
      {/* Ceramic heat pad center in middle of wire gauze */}
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 36]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Three Slender Metal Legs attaching to underside of top ring collar */}
      {legs.map((leg, idx) => (
        <group key={idx}>
          {/* Main Leg Tube */}
          <mesh position={leg.mid.toArray()} quaternion={leg.q}>
            <cylinderGeometry args={[0.007, 0.007, leg.len, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.8} />
          </mesh>

          {/* Rounded Rubber/Metal Foot Cap at bottom of leg */}
          <mesh position={leg.botPt.toArray()}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 3D Bunsen Burner / Gas Canister Burner (based on user reference image)
 */
function BunsenBurner({
  position = [0, 0, 0],
  flameRef,
  initiateReaction,
}: {
  position?: [number, number, number];
  flameRef: React.RefObject<THREE.Group | null>;
  initiateReaction: boolean;
}) {
  return (
    <group position={position}>
      {/* 1. Red Fuel Canister Cylinder Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.10, 36]} />
        <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* 2. Red Conical Top Shoulder */}
      <mesh position={[0, 0.125, 0]}>
        <cylinderGeometry args={[0.035, 0.08, 0.05, 36]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* 3. Brass Collar Mount at top of canister */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.02, 24]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* 4. Vertical Brass Chimney Pipe Tube */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.10, 24]} />
        <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* 5. Flared Brass Crown Lip at top of chimney */}
      <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.015, 0.003, 16, 32]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 6. Side Horizontal Brass Gas Stem & Black Control Knob (pointing left) */}
      <group position={[-0.035, 0.21, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.05, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.025, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* 7. Organic Turned Lathe Gas Flame */}
      {initiateReaction && <OrganicLatheFlame flameRef={flameRef} />}
    </group>
  );
}

/**
 * Organic Turned Lathe Gas Flame Profile
 */
function OrganicLatheFlame({ flameRef }: { flameRef: React.RefObject<THREE.Group | null> }) {
  const outerPoints = useMemo(() => {
    const pts = [];
    const count = 24;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const y = t * 0.09;
      const x = 0.024 * Math.sin(t * Math.PI) * (1 - 0.65 * t) + 0.003 * (1 - t);
      pts.push(new THREE.Vector2(x, y));
    }
    return pts;
  }, []);

  const innerPoints = useMemo(() => {
    const pts = [];
    const count = 18;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const y = t * 0.05;
      const x = 0.013 * Math.sin(t * Math.PI) * (1 - 0.6 * t) + 0.002 * (1 - t);
      pts.push(new THREE.Vector2(x, y));
    }
    return pts;
  }, []);

  return (
    <group ref={flameRef} position={[0, 0.27, 0]}>
      {/* Outer Warm Orange/Yellow Organic Flame */}
      <mesh position={[0, 0, 0]}>
        <latheGeometry args={[outerPoints, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Hot Blue Core Flame */}
      <mesh position={[0, 0, 0]}>
        <latheGeometry args={[innerPoints, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Warm Ambient Flame Light Glow */}
      <pointLight color="#f97316" intensity={1.2} distance={0.35} position={[0, 0.04, 0]} />
    </group>
  );
}

/**
 * Reaction Solution Component inside Coffee Cup
 */
function CalorimeterLiquidSolution({
  height,
  currentTemp,
  isExothermic,
  isDisplacement,
  initiateReaction,
}: {
  height: number;
  currentTemp: number;
  isExothermic: boolean;
  isDisplacement: boolean;
  initiateReaction: boolean;
}) {
  const yPos = 0.01 + height / 2;

  const { colorHex, opacity } = useMemo(() => {
    if (!initiateReaction) {
      if (isDisplacement) return { colorHex: '#0284c7', opacity: 0.9 };
      return { colorHex: '#38bdf8', opacity: 0.85 };
    }

    const delta = currentTemp - 25.0;

    if (isDisplacement) {
      const t = Math.min(1, Math.max(0, delta / 20.0));
      const c = new THREE.Color('#0284c7').lerp(new THREE.Color('#e2e8f0'), t);
      return { colorHex: `#${c.getHexString()}`, opacity: 0.7 + (1 - t) * 0.2 };
    }

    if (isExothermic) {
      const t = Math.min(1, Math.max(0, delta / 30.0));
      const c = new THREE.Color('#38bdf8').lerp(new THREE.Color('#ef4444'), t);
      return { colorHex: `#${c.getHexString()}`, opacity: 0.85 };
    } else {
      const t = Math.min(1, Math.max(0, -delta / 15.0));
      const c = new THREE.Color('#38bdf8').lerp(new THREE.Color('#06b6d4'), t);
      return { colorHex: `#${c.getHexString()}`, opacity: 0.85 };
    }
  }, [currentTemp, isExothermic, isDisplacement, initiateReaction]);

  return (
    <group position={[0, yPos, 0]}>
      <mesh>
        <cylinderGeometry args={[0.145, 0.13, height, 36]} />
        <meshPhysicalMaterial
          color={colorHex}
          roughness={0.1}
          transmission={0.6}
          transparent
          opacity={opacity}
          clearcoat={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Copper Precipitate Flakes for Metal Displacement */}
      {isDisplacement && initiateReaction && (
        <mesh position={[0, -height / 2 + 0.008, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.012, 24]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} metalness={0.4} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Digital Lab Thermometer Stem + Integrated LED Screen Head
 */
function DigitalLabThermometer({
  position,
  currentTemp,
  deltaT,
}: {
  position: [number, number, number];
  currentTemp: number;
  deltaT: number;
}) {
  const colHeight = Math.min(0.24, Math.max(0.04, 0.10 + (deltaT / 40.0) * 0.10));

  return (
    <group position={position}>
      {/* Outer Glass Stem */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.38, 24]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          transparent
          opacity={0.7}
          ior={1.5}
        />
      </mesh>

      {/* Bulb at Bottom */}
      <mesh position={[0, -0.13, 0]}>
        <sphereGeometry args={[0.013, 24, 24]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Inner Capillary Fluid Column */}
      <mesh position={[0, -0.13 + colHeight / 2, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, colHeight, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Integrated Digital LCD Head on Thermometer Top */}
      <group position={[0, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.16, 0.09, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[0.13, 0.065]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>

        <Text position={[0, 0.008, 0.028]} fontSize={0.036} color="#22c55e" anchorX="center" anchorY="middle">
          {`${currentTemp.toFixed(1)}°C`}
        </Text>
        <Text position={[0, -0.02, 0.028]} fontSize={0.016} color="#94a3b8" anchorX="center" anchorY="middle">
          {`ΔT: ${deltaT >= 0 ? '+' : ''}${deltaT.toFixed(1)}°C`}
        </Text>
      </group>
    </group>
  );
}

/**
 * Procedural 3D Line Graduations for Glass Beaker
 */
function BeakerGraduationTicks() {
  const ticks = [0.08, 0.15, 0.22, 0.29];
  return (
    <group position={[0, 0, 0]}>
      {ticks.map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.198]}>
          <boxGeometry args={[0.035, 0.003, 0.002]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Animated Gaseous Thermal Particles Emanating from Apparatus
 * Exothermic: Rising warm steam/heat vapor particles
 * Endothermic: Swirling cool condensation mist particles
 */
function GaseousThermalParticles({ isExothermic }: { isExothermic: boolean }) {
  const particleSeeds = useMemo(() => {
    const seeds = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const radius = 0.03 + Math.random() * 0.10;
      seeds.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        speed: 0.25 + Math.random() * 0.35,
        offset: Math.random(),
        size: 0.015 + Math.random() * 0.02,
      });
    }
    return seeds;
  }, []);

  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const clockTime = state.clock.getElapsedTime();

    particleSeeds.forEach((seed, idx) => {
      const mesh = particleRefs.current[idx];
      if (!mesh) return;

      const life = (clockTime * seed.speed + seed.offset) % 1.0;

      if (isExothermic) {
        // Warm Rising Steam / Heat Particles
        const y = 0.18 + life * 0.32;
        const expansion = 1 + life * 1.5;
        const fade = Math.sin(life * Math.PI);

        mesh.position.set(seed.x * expansion, y, seed.z * expansion);
        mesh.scale.setScalar(seed.size * (1 + life * 1.2));
        if (mesh.material instanceof THREE.Material) {
          mesh.material.opacity = fade * 0.6;
        }
      } else {
        // Cool Swirling Condensation Mist Particles
        const angleShift = clockTime * 0.8 + seed.offset * Math.PI * 2;
        const r = (seed.x * seed.x + seed.z * seed.z) ** 0.5 * (1 + life * 0.8);
        const y = 0.22 - life * 0.12;
        const fade = Math.sin(life * Math.PI);

        mesh.position.set(Math.cos(angleShift) * r, y, Math.sin(angleShift) * r);
        mesh.scale.setScalar(seed.size * (1 + life * 1.0));
        if (mesh.material instanceof THREE.Material) {
          mesh.material.opacity = fade * 0.5;
        }
      }
    });
  });

  const particleColor = isExothermic ? '#f97316' : '#38bdf8';

  return (
    <group position={[0, 0, 0]}>
      {particleSeeds.map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            particleRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={particleColor} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Clean Left-Side Floating Vector Text Readout (NO MODEL / NO RIGHT DRAWER INTERSECTION)
 */
function CleanLeftFloatingTextBadge({
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
  const processText = initiateReaction
    ? isExothermic
      ? 'EXOTHERMIC (ΔH < 0)'
      : 'ENDOTHERMIC (ΔH > 0)'
    : 'IDLE';

  return (
    <group position={[-0.85, 0.35, 0]}>
      {/* Title */}
      <Text position={[0, 0.08, 0]} fontSize={0.036} color="#0f172a" anchorX="left" anchorY="middle">
        {`${reactionType.split(' ')[0]} Calorimetry`}
      </Text>

      {/* Process Status */}
      <Text position={[0, 0.02, 0]} fontSize={0.030} color={isExothermic ? '#ef4444' : '#06b6d4'} anchorX="left" anchorY="middle">
        {`Status: ${processText}`}
      </Text>

      {/* Heat Formula */}
      <Text position={[0, -0.04, 0]} fontSize={0.032} color="#0284c7" anchorX="left" anchorY="middle">
        {`q = m · c · ΔT`}
      </Text>

      {/* Substituted Values */}
      <Text position={[0, -0.09, 0]} fontSize={0.030} color="#0369a1" anchorX="left" anchorY="middle">
        {`= ${massGrams}g × 4.18 × ${deltaT >= 0 ? '+' : ''}${deltaT.toFixed(1)}°C`}
      </Text>

      {/* Final Heat Calculation */}
      <Text position={[0, -0.14, 0]} fontSize={0.034} color="#d97706" anchorX="left" anchorY="middle">
        {`= ${heatKJ.toFixed(2)} kJ`}
      </Text>
    </group>
  );
}
