'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './index';

// -----------------------------------------------------------------------------
// REFINED SVG LATHE GEOMETRY PROFILES (Vector Turned Hardware Components)
// -----------------------------------------------------------------------------

// 1. Turned Brass Weight Plate Profile (Bevelled Rim & Central Recess)
const LATHE_WEIGHT_PLATE_PROFILE =
  'M 0,0.012 L 0.045,0.012 C 0.048,0.01 0.048,0.008 0.045,0.006 L 0.048,0.002 L 0.048,0 L 0,0 Z';

// 2. Turned Brass Handle Knob Profile (For Top of Stacked Weights)
const LATHE_KNOB_HANDLE_PROFILE =
  'M 0,0.018 L 0.01,0.018 C 0.014,0.015 0.014,0.01 0.006,0.006 L 0.006,0.002 L 0.01,0.001 L 0.01,0 L 0,0 Z';

// 3. Turned Eyebolt Hook Collar Profile
const LATHE_HOOK_COLLAR_PROFILE =
  'M 0,0.012 L 0.008,0.012 C 0.01,0.009 0.009,0.005 0.005,0.003 L 0.01,0.001 L 0.01,0 Z';

// 4. Turned Dynamometer Housing End Cap Profile
const LATHE_BALANCE_ENDCAP_PROFILE =
  'M 0,0.025 L 0.024,0.025 C 0.026,0.02 0.026,0.01 0.022,0.005 L 0.025,0 L 0,0 Z';

// 5. Turned Grooved End Pulley Wheel Profile
const LATHE_PULLEY_WHEEL_PROFILE =
  'M 0.004,0.015 L 0.025,0.015 L 0.022,0.011 C 0.018,0.008 0.018,0.005 0.022,0.002 L 0.025,0 L 0.004,0 Z';

// 6. Turned Track Support Foot Profile
const LATHE_TRACK_FOOT_PROFILE =
  'M 0,0.025 L 0.018,0.025 C 0.02,0.018 0.018,0.008 0.014,0 L 0,0 Z';

// -----------------------------------------------------------------------------
// MAIN SIMULATION MODEL COMPONENT
// -----------------------------------------------------------------------------

export default function FrictionModel() {
  // Read simulation controls from central state store
  const blockMass = useSimValue<IValueMap, 'block_mass'>('block_mass', 1);
  const surfaceCondition = useSimValue<IValueMap, 'surface_condition'>('surface_condition', 'Dry Wood');
  const initiatePull = useSimValue<IValueMap, 'initiate_pull'>('initiate_pull', false);

  // Physics constants & coefficients
  const g = 9.81; // m/s^2
  const normalForceN = blockMass * g; // Normal reaction (Newtons)

  const surfaceCoeffs = useMemo(() => {
    switch (surfaceCondition) {
      case 'Powdered':
        return { muS: 0.25, muK: 0.20, color: '#e2e8f0', roughness: 0.95 };
      case 'Oiled':
        return { muS: 0.10, muK: 0.08, color: '#331800', roughness: 0.05 };
      case 'Dry Wood':
      default:
        return { muS: 0.50, muK: 0.40, color: '#b45309', roughness: 0.70 };
    }
  }, [surfaceCondition]);

  const maxStaticFriction = surfaceCoeffs.muS * normalForceN; // Peak static force Fs
  const dynamicFriction = surfaceCoeffs.muK * normalForceN; // Steady dynamic force Fk

  // Dynamic animation state
  const [blockX, setBlockX] = useState(-0.55);
  const [currentForce, setCurrentForce] = useState(0);
  const [latchedPeakFs, setLatchedPeakFs] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const pullPhaseRef = useRef<{
    startTime: number;
    ramping: boolean;
    sliding: boolean;
  }>({
    startTime: 0,
    ramping: false,
    sliding: false,
  });

  // Reset or trigger pull animation on state change
  useEffect(() => {
    if (!initiatePull) {
      setBlockX(-0.55);
      setCurrentForce(0);
      setLatchedPeakFs(0);
      setIsSliding(false);
      pullPhaseRef.current = { startTime: 0, ramping: false, sliding: false };
    } else {
      pullPhaseRef.current = {
        startTime: performance.now() / 1000,
        ramping: true,
        sliding: false,
      };
    }
  }, [initiatePull]);

  // Frame-by-frame simulation physics update loop
  useFrame((_, delta) => {
    if (!initiatePull) return;

    const phase = pullPhaseRef.current;
    const elapsedTime = performance.now() / 1000 - phase.startTime;
    const rampDuration = 1.2; // 1.2 seconds tension ramp-up phase

    if (phase.ramping) {
      if (elapsedTime < rampDuration) {
        // Phase 1: Ramp up tension force from 0 to maxStaticFriction while block is stationary
        const progress = elapsedTime / rampDuration;
        const rampForce = progress * maxStaticFriction;
        setCurrentForce(rampForce);
        setBlockX(-0.55);
      } else {
        // Phase 2: Breakaway moment! Lock in peak static force, start sliding
        phase.ramping = false;
        phase.sliding = true;
        setLatchedPeakFs(maxStaticFriction);
        setIsSliding(true);
      }
    } else if (phase.sliding) {
      // Phase 3: Steady sliding motion at dynamic force Fk
      setCurrentForce(dynamicFriction);
      setBlockX((prevX) => {
        const nextX = prevX + delta * 0.35; // Smooth sliding velocity (m/s)
        // Cap max sliding distance so spring balance NEVER collides with the end pulley wheel!
        if (nextX >= 0.08) {
          return 0.08;
        }
        return nextX;
      });
    }
  });

  // Precise Y-coordinates for perfect surface alignment
  const trackSurfaceY = -0.213; // Top surface of the horizontal test track
  const blockCenterY = trackSurfaceY + 0.045; // Block sits EXACTLY on track surface (-0.168)
  const springBalanceX = blockX + 0.38; // Dynamometer positioned horizontally ahead of block

  return (
    <group position={[0, 0, 0]}>
      {/* 1. ACADEMIC HORIZONTAL TEST TRACK (Grounded at trackSurfaceY) */}
      <TestTrack surfaceCondition={surfaceCondition} surfaceColor={surfaceCoeffs.color} roughness={surfaceCoeffs.roughness} />

      {/* 2. WOODEN FRICTION BLOCK WITH STACKED BRASS WEIGHTS */}
      <FrictionBlock position={[blockX, blockCenterY, 0]} blockMass={blockMass} />

      {/* 3. LATHE END PULLEY WHEEL ASSEMBLY */}
      <PulleyWheel position={[0.75, blockCenterY, 0]} />

      {/* 4. NYLON PULLING CORDS */}
      {/* Front Cord: Block Hook -> Spring Balance Plunger Hook */}
      <PullingCord startPos={[blockX + 0.1175, blockCenterY, 0]} endPos={[springBalanceX - 0.12, blockCenterY, 0]} />
      {/* Rear Cord: Spring Balance -> End Pulley Wheel */}
      <PullingCord startPos={[springBalanceX + 0.12, blockCenterY, 0]} endPos={[0.75, blockCenterY, 0]} />

      {/* 5. DIGITAL SPRING BALANCE (DYNAMOMETER) WITH CALIBRATED NEWTON SCALE */}
      <DigitalSpringBalance
        position={[springBalanceX, blockCenterY, 0]}
        currentForce={currentForce}
        latchedPeakFs={latchedPeakFs}
        dynamicFriction={dynamicFriction}
        isSliding={isSliding}
        initiatePull={initiatePull}
      />

      {/* 6. BILLBOARD CAMERA-FACING 3D VECTOR FORCE DIAGRAMS & TROIKA TEXT BADGES */}
      <ForceVectorOverlay
        blockPos={[blockX, blockCenterY, 0]}
        blockMass={blockMass}
        currentForce={currentForce}
        normalForceN={normalForceN}
        muS={surfaceCoeffs.muS}
        muK={surfaceCoeffs.muK}
        isSliding={isSliding}
        initiatePull={initiatePull}
      />

      {/* 7. FLOATING BILLBOARD ACADEMIC READOUT BADGE FOR SURFACE COEFFICIENTS */}
      <SurfaceBadge surfaceCondition={surfaceCondition} muS={surfaceCoeffs.muS} muK={surfaceCoeffs.muK} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

/**
 * 1. Horizontal Test Track
 * Polished wooden base board with turned support feet resting on the floor
 */
function TestTrack({
  surfaceCondition,
  surfaceColor,
  roughness,
}: {
  surfaceCondition: string;
  surfaceColor: string;
  roughness: number;
}) {
  return (
    <group position={[0, -0.24, 0]}>
      {/* Main Track Base Board */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.60, 0.05, 0.26]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* Surface Layer Treatment (Dry Wood, Powdered, or Oiled) */}
      <mesh position={[0, 0.026, 0]}>
        <boxGeometry args={[1.59, 0.002, 0.25]} />
        <meshStandardMaterial
          color={surfaceColor}
          roughness={roughness}
          metalness={surfaceCondition === 'Oiled' ? 0.3 : 0.05}
        />
      </mesh>

      {/* Oil Film Sheen Overlay for Oiled Condition */}
      {surfaceCondition === 'Oiled' && (
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[1.59, 0.001, 0.25]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            transparent
            opacity={0.4}
            roughness={0.01}
            clearcoat={1.0}
          />
        </mesh>
      )}

      {/* Powder Specs Layer for Powdered Condition */}
      {surfaceCondition === 'Powdered' && (
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[1.59, 0.001, 0.25]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} roughness={1.0} />
        </mesh>
      )}

      {/* Turned Lathe Support Feet (4 corners) */}
      {[-0.74, 0.74].map((x, i) =>
        [-0.10, 0.10].map((z, j) => (
          <SvgLathe
            key={`foot-${i}-${j}`}
            pathData={LATHE_TRACK_FOOT_PROFILE}
            position={[x, -0.025, z]}
            rotation={[Math.PI, 0, 0]}
          >
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </SvgLathe>
        ))
      )}
    </group>
  );
}

/**
 * 2. Wooden Friction Block & Stacked Brass Weights
 * Solid wooden block resting directly on track, with brass corner brackets, turned eyebolt hook, and stacked brass mass plates (elevated 0.5mm to eliminate starburst Z-fighting)
 */
function FrictionBlock({ position, blockMass }: { position: [number, number, number]; blockMass: number }) {
  const extraWeightsCount = Math.max(0, blockMass - 1); // 1kg base block + 1kg per stacked plate

  return (
    <group position={position}>
      {/* Wooden Main Block Body (Height 0.09) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.20, 0.09, 0.13]} />
        <meshStandardMaterial color="#d97706" roughness={0.5} />
      </mesh>

      {/* Brass Corner Brackets */}
      {[-0.098, 0.098].map((x, i) =>
        [-0.063, 0.063].map((z, j) => (
          <mesh key={`bracket-${i}-${j}`} position={[x, 0, z]}>
            <boxGeometry args={[0.008, 0.088, 0.008]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Turned Brass Eyebolt Hook attached to front face */}
      <group position={[0.1015, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <SvgLathe pathData={LATHE_HOOK_COLLAR_PROFILE}>
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} polygonOffset polygonOffsetFactor={-1} />
        </SvgLathe>
        {/* Ring Eyelet Loop */}
        <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.009, 0.0025, 16, 24]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Stacked Lathe Brass Mass Discs standing upright on top of block */}
      {Array.from({ length: extraWeightsCount }).map((_, idx) => (
        <group key={`weight-${idx}`} position={[0, 0.045 + idx * 0.012, 0]} rotation={[Math.PI, 0, 0]}>
          <SvgLathe pathData={LATHE_WEIGHT_PLATE_PROFILE} segments={48}>
            <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.25} />
          </SvgLathe>
          {/* Central Locator Pin */}
          <mesh position={[0, -0.006, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.012, 16]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Top Turned Brass Handle Knob standing upright on topmost stacked weight or base block */}
      <group position={[0, 0.045 + extraWeightsCount * 0.012, 0]} rotation={[Math.PI, 0, 0]}>
        <SvgLathe pathData={LATHE_KNOB_HANDLE_PROFILE}>
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
        </SvgLathe>
      </group>
    </group>
  );
}

/**
 * 3. End Pulley Wheel
 * Lathe turned grooved brass roller mounted on a steel bracket at the track end
 */
function PulleyWheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Steel Mounting Bracket */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.015, 0.05, 0.05]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lathe Turned Grooved Roller */}
      <SvgLathe pathData={LATHE_PULLEY_WHEEL_PROFILE} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
      </SvgLathe>
    </group>
  );
}

/**
 * 4. Nylon Pulling Cord
 * Connects elements along the pulling axis
 */
function PullingCord({ startPos, endPos }: { startPos: [number, number, number]; endPos: [number, number, number] }) {
  const points = useMemo(() => [new THREE.Vector3(...startPos), new THREE.Vector3(...endPos)], [startPos, endPos]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#0284c7', linewidth: 3 }))} />
  );
}

/**
 * 5. Digital Spring Dynamometer & Calibrated Scale (Spring Balance)
 * High-definition tubular physics spring balance with internal extension spring, sliding red pointer ring,
 * 3D calibrated Newton scale ticks (0N to 50N), and live digital readout.
 */
function DigitalSpringBalance({
  position,
  currentForce,
  latchedPeakFs,
  dynamicFriction,
  isSliding,
  initiatePull,
}: {
  position: [number, number, number];
  currentForce: number;
  latchedPeakFs: number;
  dynamicFriction: number;
  isSliding: boolean;
  initiatePull: boolean;
}) {
  // Spring stretch along X axis proportional to pulling force (0 to 50N)
  const springScaleX = 1 + (currentForce / 50) * 0.7;

  // Red pointer ring position along X axis (-0.08 to +0.08)
  const pointerX = -0.08 + (currentForce / 50) * 0.16;

  return (
    <group position={position}>
      {/* High-Definition Clear Cylindrical Housing Tube */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.24, 32]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.65}
          roughness={0.05}
          clearcoat={1.0}
          depthWrite={false}
        />
      </mesh>

      {/* Blue Turned Anodized Aluminum End Caps (Left and Right) */}
      <SvgLathe pathData={LATHE_BALANCE_ENDCAP_PROFILE} position={[-0.121, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
      </SvgLathe>
      <SvgLathe pathData={LATHE_BALANCE_ENDCAP_PROFILE} position={[0.121, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
      </SvgLathe>

      {/* Internal Extension Tension Spring (Helical Steel Wire) */}
      <group position={[-0.09, 0, 0]} scale={[springScaleX, 1, 1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.010, 0.010, 0.10, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} wireframe />
        </mesh>
      </group>

      {/* Sliding Red Force Pointer Indicator Ring */}
      <mesh position={[pointerX, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.020, 0.002, 16, 24]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>

      {/* Plunger Hook Rod extending to the left */}
      <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.003, 0.003, 0.04, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Calibrated 3D Scale Tick Marks along the side of the housing tube (0N to 50N) */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const tickVal = idx * 10;
        const tickX = -0.08 + (idx / 5) * 0.16;
        return (
          <group key={`tick-${idx}`} position={[tickX, 0.023, 0]}>
            <mesh>
              <boxGeometry args={[0.0015, 0.006, 0.001]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <Billboard position={[0, 0.008, 0]}>
              <Text fontSize={0.007} color="#0f172a" anchorX="center" anchorY="bottom">
                {`${tickVal}N`}
              </Text>
            </Billboard>
          </group>
        );
      })}

      {/* LCD Digital Readout Display Screen Box mounted on top face */}
      <group position={[0, 0.038, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.024, 0.035]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>

        <Billboard position={[0, 0.013, 0]}>
          <Text position={[-0.08, 0.004, 0]} fontSize={0.009} color="#38bdf8" anchorX="left">
            {`F_pull: ${currentForce.toFixed(1)} N`}
          </Text>

          <Text position={[0.005, 0.004, 0]} fontSize={0.009} color="#f43f5e" anchorX="left">
            {`Peak Fs: ${latchedPeakFs > 0 ? latchedPeakFs.toFixed(1) : '---'} N`}
          </Text>

          <Text position={[-0.08, -0.008, 0]} fontSize={0.008} color="#a3e635" anchorX="left">
            {isSliding ? `SLIDING (Fk = ${dynamicFriction.toFixed(1)}N)` : initiatePull ? 'TENSIONING...' : 'READY'}
          </Text>
        </Billboard>
      </group>

      {/* Top Billboard Title Badge */}
      <Billboard position={[0, 0.075, 0]}>
        <Text fontSize={0.012} color="#0284c7" anchorX="center" anchorY="bottom">
          SPRING BALANCE (DYNAMOMETER)
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * 6. Dynamic 3D Vector Force Arrows & Camera-Facing Billboard Troika Text Badges
 * Wrapped in Billboard so vector texts ALWAYS face the camera cleanly without mirroring!
 */
function ForceVectorOverlay({
  blockPos,
  blockMass,
  currentForce,
  normalForceN,
  muS,
  muK,
  isSliding,
  initiatePull,
}: {
  blockPos: [number, number, number];
  blockMass: number;
  currentForce: number;
  normalForceN: number;
  muS: number;
  muK: number;
  isSliding: boolean;
  initiatePull: boolean;
}) {
  const extraWeightsCount = Math.max(0, blockMass - 1);
  // Calculate exact top of stacked weights so Normal vector starts ABOVE all meshes
  const topOfStackRelY = 0.045 + extraWeightsCount * 0.012 + 0.025;

  // Proportional vector length clamping: min 0.08, max 0.18
  const normalVectorLen = Math.min(0.18, Math.max(0.08, 0.06 + normalForceN * 0.0018));
  const pullVectorLen = Math.min(0.16, Math.max(0.06, 0.05 + currentForce * 0.0025));
  const frictionVectorLen = Math.min(
    0.16,
    Math.max(0.06, 0.05 + (isSliding ? muK * normalForceN : currentForce) * 0.0025)
  );

  return (
    <group position={blockPos}>
      {/* 1. Pulling Force Vector (Cyan Arrow Right) */}
      {initiatePull && (
        <group position={[0.11, 0, 0]}>
          <VectorArrow length={pullVectorLen} color="#0284c7" rotation={[0, 0, -Math.PI / 2]} />
          <Billboard position={[pullVectorLen + 0.025, 0.02, 0]}>
            <Text
              fontSize={0.020}
              color="#0284c7"
              anchorX="left"
              anchorY="middle"
            >
              {`F_pull = ${currentForce.toFixed(1)}N`}
            </Text>
          </Billboard>
        </group>
      )}

      {/* 2. Frictional Force Vector (Red Arrow Left) */}
      {initiatePull && (
        <group position={[-0.11, 0, 0]}>
          <VectorArrow length={frictionVectorLen} color="#dc2626" rotation={[0, 0, Math.PI / 2]} />
          <Billboard position={[-frictionVectorLen - 0.025, 0.02, 0]}>
            <Text
              fontSize={0.020}
              color="#dc2626"
              anchorX="right"
              anchorY="middle"
            >
              {isSliding ? `Fk = ${(muK * normalForceN).toFixed(1)}N` : `Fs = ${currentForce.toFixed(1)}N`}
            </Text>
          </Billboard>
        </group>
      )}

      {/* 3. Normal Reaction Force Vector (Green Arrow Up - Starts ABOVE weight stack!) */}
      <group position={[0, topOfStackRelY, 0]}>
        <VectorArrow length={normalVectorLen} color="#16a34a" rotation={[0, 0, 0]} />
        <Billboard position={[0, normalVectorLen + 0.025, 0]}>
          <Text
            fontSize={0.020}
            color="#16a34a"
            anchorX="center"
            anchorY="bottom"
          >
            {`N = ${normalForceN.toFixed(1)}N`}
          </Text>
        </Billboard>
      </group>

      {/* 4. Gravitational Weight Vector (Purple Arrow Down - Starts BELOW track board!) */}
      <group position={[0, -0.05, 0]}>
        <VectorArrow length={normalVectorLen} color="#7c3aed" rotation={[Math.PI, 0, 0]} />
        <Billboard position={[0, -normalVectorLen - 0.025, 0]}>
          <Text
            fontSize={0.020}
            color="#7c3aed"
            anchorX="center"
            anchorY="top"
          >
            {`W = m·g = ${normalForceN.toFixed(1)}N`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

/**
 * Helper 3D Vector Arrow Component
 * Cylinder shaft + Cone arrowhead
 */
function VectorArrow({ length, color, rotation }: { length: number; color: string; rotation: [number, number, number] }) {
  return (
    <group rotation={rotation}>
      {/* Arrow Shaft */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[0.003, 0.003, length, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Arrowhead Cone */}
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[0.008, 0.02, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * 7. Surface Badge Component
 * Displays surface treatment status and friction coefficients wrapped in Billboard to face camera
 */
function SurfaceBadge({ surfaceCondition, muS, muK }: { surfaceCondition: string; muS: number; muK: number }) {
  return (
    <group position={[0, 0.44, -0.1]}>
      <Billboard>
        <Text fontSize={0.024} color="#0f172a" anchorX="center" anchorY="middle">
          {`Surface Condition: ${surfaceCondition}  (μs = ${muS.toFixed(2)}, μk = ${muK.toFixed(2)})`}
        </Text>
      </Billboard>
    </group>
  );
}
