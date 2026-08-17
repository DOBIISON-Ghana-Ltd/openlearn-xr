'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v1';

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
  'M 0,0.012 L 0.008,0.012 C 0.01,0.009 0.009,0.005 0.005,0.003 L 0.01,0.001 L 0.01,0 L 0,0 Z';

// 4. Turned Dynamometer Housing End Cap Profile
const LATHE_BALANCE_ENDCAP_PROFILE =
  'M 0,0.025 L 0.024,0.025 C 0.026,0.02 0.026,0.01 0.022,0.005 L 0.025,0 L 0,0 Z';

// 5. Turned Grooved End Pulley Wheel Profile
const LATHE_PULLEY_WHEEL_PROFILE =
  'M 0.004,0.015 L 0.025,0.015 L 0.022,0.011 C 0.018,0.008 0.018,0.005 0.022,0.002 L 0.025,0 L 0.004,0 Z';

// 6. Turned Track Support Foot Profile
const LATHE_TRACK_FOOT_PROFILE =
  'M 0,0.025 L 0.018,0.025 C 0.02,0.018 0.018,0.008 0.014,0 L 0,0 Z';

/**
 * Reusable SVG Lathe Component
 * Converts SVG path data into smooth 3D lathe geometries
 */
function SvgLathe({
  pathData,
  segments = 48,
  subdivisions = 40,
  children,
  ...props
}: {
  pathData: string;
  segments?: number;
  subdivisions?: number;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  const points = useMemo(() => {
    const loader = new SVGLoader();
    const strokeData = loader.parse(`<svg><path d="${pathData}" /></svg>`);
    if (!strokeData.paths.length) return [];
    const shapes = SVGLoader.createShapes(strokeData.paths[0]);
    if (!shapes.length) return [];
    const rawPoints = shapes[0].getPoints(subdivisions);
    return rawPoints.map((p) => new THREE.Vector2(p.x, -p.y));
  }, [pathData, subdivisions]);

  if (!points.length) return null;

  return (
    <mesh {...props}>
      <latheGeometry args={[points, segments]} />
      {children}
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// MAIN SIMULATION MODEL COMPONENT
// -----------------------------------------------------------------------------

export default function FrictionModelV1() {
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

      {/* 2. WOODEN FRICTION BLOCK WITH STACKED LATHE BRASS WEIGHTS */}
      <FrictionBlock position={[blockX, blockCenterY, 0]} blockMass={blockMass} />

      {/* 3. LATHE END PULLEY WHEEL ASSEMBLY */}
      <PulleyWheel position={[0.75, blockCenterY, 0]} />

      {/* 4. NYLON PULLING CORDS */}
      {/* Front Cord: Block Hook -> Spring Balance Plunger Hook */}
      <PullingCord startPos={[blockX + 0.1175, blockCenterY, 0]} endPos={[springBalanceX - 0.12, blockCenterY, 0]} />
      {/* Rear Cord: Spring Balance -> End Pulley Wheel */}
      <PullingCord startPos={[springBalanceX + 0.12, blockCenterY, 0]} endPos={[0.75, blockCenterY, 0]} />

      {/* 5. SPRING DYNAMOMETER WITH CALIBRATED NEWTON SCALE */}
      <DigitalSpringBalance
        position={[springBalanceX, blockCenterY, 0]}
        currentForce={currentForce}
        latchedPeakFs={latchedPeakFs}
        dynamicFriction={dynamicFriction}
        isSliding={isSliding}
        initiatePull={initiatePull}
      />

      {/* 6. 3D VECTOR FORCE DIRECTIONAL ARROWS ON BLOCK */}
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
      {/* Main Track Base Board — warm wood clay */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.60, 0.05, 0.26]} />
        <meshStandardMaterial color="#c29b74" roughness={0.95} metalness={0} />
      </mesh>

      {/* Surface Layer Treatment (Dry Wood, Powdered, or Oiled) */}
      <mesh position={[0, 0.026, 0]}>
        <boxGeometry args={[1.59, 0.002, 0.25]} />
        <meshStandardMaterial
          color={surfaceCondition === 'Dry Wood' ? '#d4a373' : surfaceCondition === 'Powdered' ? '#f1f5f9' : '#a16207'}
          roughness={roughness}
          metalness={0}
        />
      </mesh>

      {/* Oil Film Sheen Overlay for Oiled Condition */}
      {surfaceCondition === 'Oiled' && (
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[1.59, 0.001, 0.25]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            transparent
            opacity={0.3}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Powder Specs Layer for Powdered Condition */}
      {surfaceCondition === 'Powdered' && (
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[1.59, 0.001, 0.25]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={1.0} metalness={0} />
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
            <meshStandardMaterial color="#475569" roughness={0.9} metalness={0} />
          </SvgLathe>
        ))
      )}
    </group>
  );
}

/**
 * 2. Wooden Friction Block & Lathe Stacked Weights
 * Solid wooden block resting directly on track, with brass corner brackets, turned eyebolt hook, and stacked lathe brass plates
 */
function FrictionBlock({ position, blockMass }: { position: [number, number, number]; blockMass: number }) {
  const extraWeightsCount = Math.max(0, blockMass - 1); // 1kg base block + 1kg per stacked plate

  return (
    <group position={position}>
      {/* Wooden Main Block Body — warm terracotta clay */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.20, 0.09, 0.13]} />
        <meshStandardMaterial color="#c67d5a" roughness={0.9} metalness={0} />
      </mesh>

      {/* Pastel Brass Corner Brackets */}
      {[-0.098, 0.098].map((x, i) =>
        [-0.063, 0.063].map((z, j) => (
          <mesh key={`bracket-${i}-${j}`} position={[x, 0, z]}>
            <boxGeometry args={[0.008, 0.088, 0.008]} />
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </mesh>
        ))
      )}

      {/* Turned Brass Eyebolt Hook attached to front face */}
      <group position={[0.1015, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <SvgLathe pathData={LATHE_HOOK_COLLAR_PROFILE}>
          <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} polygonOffset polygonOffsetFactor={-1} />
        </SvgLathe>
        {/* Ring Eyelet Loop */}
        <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.009, 0.0025, 16, 24]} />
          <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
        </mesh>
      </group>

      {/* Stacked Lathe Brass Mass Discs — soft yellow clay */}
      {Array.from({ length: extraWeightsCount }).map((_, idx) => (
        <group key={`weight-${idx}`} position={[0, 0.045 + (idx + 1) * 0.012, 0]}>
          <SvgLathe pathData={LATHE_WEIGHT_PLATE_PROFILE} segments={48}>
            <meshStandardMaterial color="#f3c969" roughness={0.85} metalness={0} />
          </SvgLathe>
          {/* Central Locator Pin */}
          <mesh position={[0, -0.006, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.012, 16]} />
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Top Handle Knob on topmost stacked weight or base block */}
      <SvgLathe
        pathData={LATHE_KNOB_HANDLE_PROFILE}
        position={[0, 0.045 + extraWeightsCount * 0.012 + 0.018, 0]}
      >
        <meshStandardMaterial color="#e5b061" roughness={0.85} metalness={0} />
      </SvgLathe>
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
      {/* Matte Slate Mounting Bracket */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.015, 0.05, 0.05]} />
        <meshStandardMaterial color="#475569" roughness={0.85} metalness={0} />
      </mesh>
      {/* Lathe Turned Grooved Roller */}
      <SvgLathe pathData={LATHE_PULLEY_WHEEL_PROFILE} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
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
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#64748b', linewidth: 2 }))} />
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
      {/* Frosted Translucent Cylindrical Housing Tube */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.24, 32]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transparent
          opacity={0.6}
          roughness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Turned Soft Slate Blue End Caps (Left and Right) */}
      <SvgLathe pathData={LATHE_BALANCE_ENDCAP_PROFILE} position={[-0.121, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#4a7c9d" roughness={0.85} metalness={0} />
      </SvgLathe>
      <SvgLathe pathData={LATHE_BALANCE_ENDCAP_PROFILE} position={[0.121, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#4a7c9d" roughness={0.85} metalness={0} />
      </SvgLathe>

      {/* Internal Extension Tension Spring */}
      <group position={[-0.09, 0, 0]} scale={[springScaleX, 1, 1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.010, 0.010, 0.10, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} metalness={0} wireframe />
        </mesh>
      </group>

      {/* Sliding Coral Red Force Pointer Indicator Ring */}
      <mesh position={[pointerX, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.020, 0.0025, 16, 24]} />
        <meshStandardMaterial color="#f87171" roughness={0.8} metalness={0} />
      </mesh>

      {/* Plunger Hook Rod extending to the left */}
      <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.003, 0.003, 0.04, 12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0} />
      </mesh>

      {/* Calibrated Scale Tick Marks along the side of the housing tube (0N to 50N) */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const tickX = -0.08 + (idx / 5) * 0.16;
        return (
          <group key={`tick-${idx}`} position={[tickX, 0.023, 0]}>
            <mesh>
              <boxGeometry args={[0.0015, 0.006, 0.001]} />
              <meshBasicMaterial color="#64748b" />
            </mesh>
          </group>
        );
      })}
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
  const topOfStackRelY = 0.045 + extraWeightsCount * 0.012 + 0.025;

  // Proportional vector length clamping: min 0.08, max 0.18
  const normalVectorLen = Math.min(0.18, Math.max(0.08, 0.06 + normalForceN * 0.0018));
  const gravityVectorLen = Math.min(0.24, Math.max(0.13, 0.09 + normalForceN * 0.0022));
  const pullVectorLen = Math.min(0.16, Math.max(0.06, 0.05 + currentForce * 0.0025));
  const frictionVectorLen = Math.min(
    0.16,
    Math.max(0.06, 0.05 + (isSliding ? muK * normalForceN : currentForce) * 0.0025)
  );

  return (
    <group position={blockPos}>
      {/* 1. Pulling Force Vector (Sky Blue Arrow Right) */}
      {initiatePull && (
        <group position={[0.11, 0, 0]}>
          <VectorArrow length={pullVectorLen} color="#38bdf8" rotation={[0, 0, -Math.PI / 2]} />
          <Billboard position={[pullVectorLen + 0.025, 0.02, 0]}>
            <Text
              fontSize={0.014}
              color="#0284c7"
              anchorX="center"
              anchorY="middle"
            >
              {`F_pull = ${currentForce.toFixed(1)}N`}
            </Text>
          </Billboard>
        </group>
      )}

      {/* 2. Frictional Force Vector (Coral Red Arrow Left) */}
      {initiatePull && (
        <group position={[-0.11, 0, 0]}>
          <VectorArrow length={frictionVectorLen} color="#f87171" rotation={[0, 0, Math.PI / 2]} />
          <Billboard position={[-frictionVectorLen - 0.025, 0.02, 0]}>
            <Text
              fontSize={0.014}
              color="#e05252"
              anchorX="center"
              anchorY="middle"
            >
              {isSliding ? `Fk = ${(muK * normalForceN).toFixed(1)}N` : `Fs = ${currentForce.toFixed(1)}N`}
            </Text>
          </Billboard>
        </group>
      )}

      {/* 3. Normal Reaction Force Vector (Sage Green Arrow Up) */}
      <group position={[0, topOfStackRelY, 0]}>
        <VectorArrow length={normalVectorLen} color="#4ade80" rotation={[0, 0, 0]} />
        <Billboard position={[0, normalVectorLen + 0.025, 0]}>
          <Text
            fontSize={0.018}
            color="#16a34a"
            anchorX="center"
            anchorY="bottom"
          >
            {`N = ${normalForceN.toFixed(1)}N`}
          </Text>
        </Billboard>
      </group>

      {/* 4. Gravitational Weight Vector (Soft Purple Arrow Down) */}
      <group position={[0, -0.06, 0]}>
        <VectorArrow length={gravityVectorLen} color="#a78bfa" rotation={[Math.PI, 0, 0]} />
        <Billboard position={[0, -gravityVectorLen - 0.025, 0]}>
          <Text
            fontSize={0.018}
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
 * ForcesFrictionOverlay
 * Pure DOM component — reads from the same Zustand simStore.
 * Renders fixed/absolute on the left side of the viewport, completely immune
 * to OrbitControls rotation and panning.
 */
export function ForcesFrictionOverlay() {
  const blockMass = useSimValue<IValueMap, 'block_mass'>('block_mass', 1);
  const surfaceCondition = useSimValue<IValueMap, 'surface_condition'>('surface_condition', 'Dry Wood');
  const initiatePull = useSimValue<IValueMap, 'initiate_pull'>('initiate_pull', false);

  const g = 9.81;
  const normalForceN = blockMass * g;

  const surfaceCoeffs = useMemo(() => {
    switch (surfaceCondition) {
      case 'Powdered':
        return { muS: 0.25, muK: 0.20 };
      case 'Oiled':
        return { muS: 0.10, muK: 0.08 };
      case 'Dry Wood':
      default:
        return { muS: 0.50, muK: 0.40 };
    }
  }, [surfaceCondition]);

  const maxStaticFriction = surfaceCoeffs.muS * normalForceN;
  const dynamicFriction = surfaceCoeffs.muK * normalForceN;

  const [currentForce, setCurrentForce] = useState(0);
  const [latchedPeakFs, setLatchedPeakFs] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (!initiatePull) {
      setCurrentForce(0);
      setLatchedPeakFs(0);
      setIsSliding(false);
      return;
    }

    const startTime = performance.now() / 1000;
    const rampDuration = 1.2;
    let animId: number;

    const update = () => {
      const now = performance.now() / 1000;
      const elapsed = now - startTime;

      if (elapsed < rampDuration) {
        const progress = elapsed / rampDuration;
        setCurrentForce(progress * maxStaticFriction);
        setIsSliding(false);
        animId = requestAnimationFrame(update);
      } else {
        setLatchedPeakFs(maxStaticFriction);
        setCurrentForce(dynamicFriction);
        setIsSliding(true);
      }
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [initiatePull, maxStaticFriction, dynamicFriction]);

  const statusColor = !initiatePull ? '#64748b' : isSliding ? '#22c55e' : '#f59e0b';
  const statusText = !initiatePull ? 'Ready / Stationary' : isSliding ? 'Sliding (Dynamic)' : 'Tensioning (Static)';

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
        minWidth: 175,
      }}
    >
      {/* Live Pull Force Card */}
      <div
        style={{
          background: 'rgba(244, 248, 255, 0.94)',
          border: '1px solid rgba(100, 160, 230, 0.35)',
          borderRadius: 14,
          padding: '14px 18px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            color: '#7a9ec0',
            fontFamily: 'system-ui',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Spring Balance Force
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '6px 0 4px' }}>
          <span style={{ fontSize: 30, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 800, lineHeight: 1 }}>
            {currentForce.toFixed(1)} N
          </span>
          <span
            style={{
              fontSize: 11,
              color: statusColor,
              fontFamily: 'system-ui',
              fontWeight: 700,
              backgroundColor: `${statusColor}18`,
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* Surface Treatment & Friction Coefficients Card */}
      <div
        style={{
          background: 'rgba(244, 248, 255, 0.94)',
          border: '1px solid rgba(100, 160, 230, 0.35)',
          borderRadius: 14,
          padding: '14px 18px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            color: '#7a9ec0',
            fontFamily: 'system-ui',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Surface Material
        </p>
        <p
          style={{
            margin: '5px 0 6px',
            fontSize: 18,
            color: '#1e3a5f',
            fontFamily: 'system-ui',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {surfaceCondition}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <div>
            <span style={{ fontSize: 10, color: '#8ab0d0', fontFamily: 'system-ui' }}>Static (μs)</span>
            <p style={{ margin: '2px 0 0', fontSize: 16, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
              {surfaceCoeffs.muS.toFixed(2)}
            </p>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(100, 160, 230, 0.2)' }} />
          <div>
            <span style={{ fontSize: 10, color: '#8ab0d0', fontFamily: 'system-ui' }}>Kinetic (μk)</span>
            <p style={{ margin: '2px 0 0', fontSize: 16, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
              {surfaceCoeffs.muK.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Forces Breakdown Card */}
      <div
        style={{
          background: 'rgba(244, 248, 255, 0.94)',
          border: '1px solid rgba(100, 160, 230, 0.35)',
          borderRadius: 14,
          padding: '14px 18px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            color: '#7a9ec0',
            fontFamily: 'system-ui',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Force Calculations
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Normal Force (N = mg)</span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 600 }}>
              {normalForceN.toFixed(1)} N
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Max Static Fs (μs·N)</span>
            <span style={{ fontSize: 12, color: '#e05252', fontFamily: 'system-ui', fontWeight: 700 }}>
              {maxStaticFriction.toFixed(1)} N
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Dynamic Fk (μk·N)</span>
            <span style={{ fontSize: 12, color: '#0284c7', fontFamily: 'system-ui', fontWeight: 700 }}>
              {dynamicFriction.toFixed(1)} N
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Block Mass (m)</span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 600 }}>
              {blockMass} kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
