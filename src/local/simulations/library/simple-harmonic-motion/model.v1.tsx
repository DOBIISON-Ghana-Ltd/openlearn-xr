'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v1';

// -----------------------------------------------------------------------------
// REFINED SVG LATHE GEOMETRY PROFILES (Turned Hardware Parts)
// -----------------------------------------------------------------------------

// 1. Turned Precision Pendulum Bob Profile (Teardrop / Spherical Brass Bob with Collar)
const LATHE_PENDULUM_BOB_PROFILE =
  'M 0,0.038 L 0.007,0.038 L 0.007,0.03 C 0.007,0.026 0.003,0.024 0.003,0.022 L 0.022,0.015 C 0.026,0.005 0.026,-0.008 0.019,-0.018 C 0.013,-0.024 0.006,-0.026 0,-0.027 Z';

// 2. Turned Bosshead Clamp Thumb-Screw Profile (Knurled Brass Screw Knob)
const LATHE_BOSSHEAD_KNOB_PROFILE =
  'M 0,0.016 L 0.009,0.016 C 0.011,0.013 0.011,0.009 0.006,0.005 L 0.006,0.002 L 0.009,0.001 L 0.009,0 Z';

// 3. Turned Retort Rod Beveled Top Cap Profile
const LATHE_ROD_TOP_CAP_PROFILE =
  'M 0,0.014 L 0.008,0.014 C 0.01,0.01 0.01,0.004 0.008,0.002 L 0.008,0 Z';

// 4. Turned Base Support Rubber Foot Profile
const LATHE_STAND_FOOT_PROFILE =
  'M 0,0.016 L 0.014,0.016 C 0.016,0.012 0.016,0.006 0.012,0.002 L 0.01,0 Z';

// 5. Turned Suspension Pivot Sleeve Collar Profile
const LATHE_PROTRACTOR_PIVOT_CAP_PROFILE =
  'M 0,0.016 L 0.013,0.016 C 0.015,0.011 0.011,0.006 0.006,0.003 L 0.006,0 Z';

// -----------------------------------------------------------------------------
// 3D PROTRACTOR ANGLE GAUGE ARC (Inspired by PhET Pendulum Lab)
// -----------------------------------------------------------------------------

function ProtractorArc({ radius = 0.22 }: { radius?: number }) {
  const { arcLine, tickLines } = useMemo(() => {
    // Semi-circular arc path from -85° to +85°
    const arcPts: THREE.Vector3[] = [];
    const minAngle = (-85 * Math.PI) / 180;
    const maxAngle = (85 * Math.PI) / 180;
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const a = minAngle + (i / steps) * (maxAngle - minAngle);
      arcPts.push(new THREE.Vector3(radius * Math.sin(a), -radius * Math.cos(a), 0));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);

    // Degree ticks every 5°, 10°, and 30°
    const ticks: THREE.BufferGeometry[] = [];
    for (let deg = -80; deg <= 80; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const isThirty = deg % 30 === 0;
      const isMajor = deg % 10 === 0;
      const tickLen = isThirty ? 0.022 : isMajor ? 0.014 : 0.007;

      const innerR = radius - tickLen / 2;
      const outerR = radius + tickLen / 2;

      const p1 = new THREE.Vector3(innerR * Math.sin(rad), -innerR * Math.cos(rad), 0);
      const p2 = new THREE.Vector3(outerR * Math.sin(rad), -outerR * Math.cos(rad), 0);
      ticks.push(new THREE.BufferGeometry().setFromPoints([p1, p2]));
    }

    return { arcLine: arcGeo, tickLines: ticks };
  }, [radius]);

  // Center dashed equilibrium line
  const centerlineGeo = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -radius * 1.4, 0)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <group position={[0, 0, -0.005]}>
      {/* Curved Degree Arc */}
      <primitive object={new THREE.Line(arcLine, new THREE.LineBasicMaterial({ color: '#7aaec8', transparent: true, opacity: 0.75 }))} />

      {/* Graduation Ticks */}
      {tickLines.map((geo, idx) => (
        <primitive
          key={idx}
          object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#5a8ca8', transparent: true, opacity: 0.85 }))}
        />
      ))}

      {/* Center Dashed Equilibrium Line (Sky Blue) */}
      <primitive
        object={
          new THREE.Line(
            centerlineGeo,
            new THREE.LineDashedMaterial({
              color: '#38bdf8',
              dashSize: 0.015,
              gapSize: 0.012,
              transparent: true,
              opacity: 0.65,
            })
          )
        }
      />
    </group>
  );
}

// -----------------------------------------------------------------------------
// 3D METER RULE COMPONENT
// -----------------------------------------------------------------------------

function HeroMeterRule({ lengthM, position }: { lengthM: number; position: [number, number, number] }) {
  const ticks = useMemo(() => {
    const list: { pos: number; isMajor: boolean }[] = [];
    for (let cm = 0; cm <= 100; cm += 5) {
      const pos = gsap.utils.mapRange(0, 100, 0.32, -0.32, cm);
      list.push({
        pos,
        isMajor: cm % 10 === 0,
      });
    }
    return list;
  }, []);

  const visualLen = gsap.utils.mapRange(0.1, 1.5, 0.12, 0.58, lengthM);
  const indicatorY = 0.32 - visualLen;

  return (
    <group position={position}>
      {/* Wood Rule Main Body — warm clay wood */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.038, 0.68, 0.009]} />
        <meshStandardMaterial color="#c29b74" roughness={0.95} metalness={0} />
      </mesh>

      {/* Front Bevel Surface Plate */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.035, 0.67, 0.001]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} metalness={0} />
      </mesh>

      {/* Graduation Ticks */}
      {ticks.map((tick, idx) => (
        <group key={idx} position={[-0.009, tick.pos, 0.0056]}>
          <mesh position={[tick.isMajor ? 0 : 0.003, 0, 0]}>
            <boxGeometry args={[tick.isMajor ? 0.015 : 0.008, 0.0018, 0.0005]} />
            <meshBasicMaterial color="#475569" />
          </mesh>
        </group>
      ))}

      {/* Top and Bottom Brass Mounting Clips */}
      {[-0.30, 0.30].map((yClip, i) => (
        <group key={i} position={[-0.022, yClip, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </SvgLathe>
        </group>
      ))}

      {/* Dynamic Red String Length Indicator Pointer */}
      <group position={[0, indicatorY, 0.006]}>
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.038, 0.003, 0.002]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// 3D VECTOR ARROW HELPER (For Velocity & Acceleration Vectors)
// -----------------------------------------------------------------------------

function VectorArrow({ length, color, rotation }: { length: number; color: string; rotation: [number, number, number] }) {
  if (Math.abs(length) < 0.005) return null;
  const dir = Math.sign(length) || 1;
  const absLen = Math.min(0.25, Math.abs(length));

  return (
    <group rotation={rotation}>
      {/* Arrow Shaft */}
      <mesh position={[0, (dir * absLen) / 2, 0]}>
        <cylinderGeometry args={[0.003, 0.003, absLen, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Arrowhead Cone */}
      <mesh position={[0, dir * absLen, 0]} rotation={[dir > 0 ? 0 : Math.PI, 0, 0]}>
        <coneGeometry args={[0.008, 0.02, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// MAIN SIMPLE HARMONIC MOTION MODEL COMPONENT
// -----------------------------------------------------------------------------

export default function SimpleHarmonicMotionModelV1() {
  // Read simulation controls from central state store
  const pendulumLength = useSimValue<IValueMap, 'pendulum_length'>('pendulum_length', 0.70);
  const bobMass = useSimValue<IValueMap, 'bob_mass'>('bob_mass', 1.00);
  const initialAngleDeg = useSimValue<IValueMap, 'initial_angle'>('initial_angle', 25);
  const gravityEnv = useSimValue<IValueMap, 'gravity_environment'>('gravity_environment', 'Earth (9.81 m/s²)');
  const customGravity = useSimValue<IValueMap, 'custom_gravity'>('custom_gravity', 9.81);
  const frictionDamping = useSimValue<IValueMap, 'friction_damping'>('friction_damping', 'None (Vacuum)');
  const targetSwings = useSimValue<IValueMap, 'target_swings'>('target_swings', 'Continuous (Free Run)');
  const simSpeed = useSimValue<IValueMap, 'simulation_speed'>('simulation_speed', 'Normal (1.0x)');
  const showEnergyVectors = useSimValue<IValueMap, 'show_energy_vectors'>('show_energy_vectors', false);
  const showProtractor = useSimValue<IValueMap, 'show_protractor'>('show_protractor', true);
  const showRuler = useSimValue<IValueMap, 'show_ruler'>('show_ruler', true);
  const releasePendulum = useSimValue<IValueMap, 'release_pendulum'>('release_pendulum', false);
  const resetSetup = useSimValue<IValueMap, 'reset_setup'>('reset_setup', false);

  // Gravity constant mapping
  const g = useMemo(() => {
    switch (gravityEnv) {
      case 'Moon (1.62 m/s²)':
        return 1.62;
      case 'Mars (3.72 m/s²)':
        return 3.72;
      case 'Jupiter (24.79 m/s²)':
        return 24.79;
      case 'Zero Gravity (0 m/s²)':
        return 0.0;
      case 'Custom Value':
        return customGravity;
      case 'Earth (9.81 m/s²)':
      default:
        return 9.81;
    }
  }, [gravityEnv, customGravity]);

  // Air resistance damping factor gamma
  const dampingGamma = useMemo(() => {
    switch (frictionDamping) {
      case 'Low (Air)':
        return 0.04;
      case 'Medium':
        return 0.12;
      case 'High':
        return 0.32;
      case 'None (Vacuum)':
      default:
        return 0.0;
    }
  }, [frictionDamping]);

  const maxTargetCycles = useMemo(() => {
    switch (targetSwings) {
      case '5 Swings':
        return 5;
      case '10 Swings (Standard)':
        return 10;
      case '20 Swings':
        return 20;
      case 'Continuous (Free Run)':
      default:
        return Infinity;
    }
  }, [targetSwings]);

  const speedMult = simSpeed === 'Slow Motion (0.5x)' ? 0.5 : simSpeed === 'Quarter Speed (0.25x)' ? 0.25 : 1.0;

  // Numerical state refs
  const angleRef = useRef((initialAngleDeg * Math.PI) / 180);
  const omegaRef = useRef(0);
  const prevAngleSignRef = useRef(1);
  const cyclesCountRef = useRef(0);
  const isStoppedRef = useRef(false);

  // Visual state for R3F rendering
  const [currentAngle, setCurrentAngle] = useState((initialAngleDeg * Math.PI) / 180);
  const [angularVelocity, setAngularVelocity] = useState(0);

  // Reset or initialize state
  useEffect(() => {
    const theta0 = (initialAngleDeg * Math.PI) / 180;
    angleRef.current = theta0;
    omegaRef.current = 0;
    prevAngleSignRef.current = Math.sign(theta0) || 1;
    cyclesCountRef.current = 0;
    isStoppedRef.current = false;
    setCurrentAngle(theta0);
    setAngularVelocity(0);
  }, [initialAngleDeg, pendulumLength, resetSetup]);

  // Physics Integration Loop inside useFrame
  useFrame((_, delta) => {
    if (!releasePendulum || resetSetup || isStoppedRef.current) {
      if (!releasePendulum) {
        const theta0 = (initialAngleDeg * Math.PI) / 180;
        angleRef.current = theta0;
        omegaRef.current = 0;
        setCurrentAngle(theta0);
        setAngularVelocity(0);
      }
      return;
    }

    if (g === 0) return; // Zero gravity

    const dtTotal = Math.min(delta, 0.05) * speedMult;
    const subSteps = 8;
    const dt = dtTotal / subSteps;

    let theta = angleRef.current;
    let omega = omegaRef.current;

    for (let i = 0; i < subSteps; i++) {
      const alpha1 = -(g / pendulumLength) * Math.sin(theta) - (dampingGamma / bobMass) * omega;
      const thetaMid = theta + 0.5 * dt * omega;
      const omegaMid = omega + 0.5 * dt * alpha1;

      const alpha2 = -(g / pendulumLength) * Math.sin(thetaMid) - (dampingGamma / bobMass) * omegaMid;
      theta += dt * omegaMid;
      omega += dt * alpha2;
    }

    // Cycle counting: detect positive zero-crossing
    const currentSign = Math.sign(theta);
    if (prevAngleSignRef.current < 0 && currentSign >= 0) {
      cyclesCountRef.current += 1;
      if (cyclesCountRef.current >= maxTargetCycles) {
        isStoppedRef.current = true;
      }
    }
    prevAngleSignRef.current = currentSign;

    angleRef.current = theta;
    omegaRef.current = omega;
    setCurrentAngle(theta);
    setAngularVelocity(omega);
  });

  // Hero Layout Origins
  const PIVOT_POS: [number, number, number] = [0, 0.32, 0];
  const STAND_X = -0.24;

  // Proportional Visual String Length mapping
  const visualStringLength = gsap.utils.mapRange(0.1, 1.5, 0.12, 0.58, pendulumLength);

  // Bob scale based on mass (0.1kg -> 0.7x, 2.0kg -> 1.35x)
  const bobScale = 0.7 + (bobMass / 2.0) * 0.65;

  // Real-time tangential velocity & radial acceleration vector lengths
  const tangentialVel = pendulumLength * angularVelocity;
  const velVectorLen = tangentialVel * 0.08;
  const centripetalAcc = pendulumLength * angularVelocity * angularVelocity;
  const accVectorLen = centripetalAcc * 0.03;

  return (
    <group position={[0, 0, 0]}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. ACADEMIC LAB WORKBENCH TABLE SURFACE (Warm Slate & Ceramic Top)   */}
      {/* ------------------------------------------------------------------- */}
      {/* Table Top Plate */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.7, 0.035, 0.95]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} metalness={0} />
      </mesh>
      {/* Table Top Ceramic Work Surface Mat */}
      <mesh position={[0, -0.401, 0]}>
        <boxGeometry args={[1.66, 0.002, 0.91]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.95} metalness={0} />
      </mesh>

      {/* ------------------------------------------------------------------- */}
      {/* 2. COHESIVE RETORT STAND ASSEMBLY (Matte Clay Slate)                */}
      {/* ------------------------------------------------------------------- */}
      <group position={[STAND_X, -0.385, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.025, 0.18]} />
          <meshStandardMaterial color="#334155" roughness={0.9} metalness={0} />
        </mesh>

        {/* Turned Rubber Base Support Feet */}
        {[
          [-0.10, -0.06],
          [0.10, -0.06],
          [-0.10, 0.06],
          [0.10, 0.06],
        ].map(([fx, fz], idx) => (
          <SvgLathe key={idx} pathData={LATHE_STAND_FOOT_PROFILE} position={[fx, -0.013, fz]}>
            <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0} />
          </SvgLathe>
        ))}

        {/* Stainless Steel Vertical Rod rising straight from Base */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.76, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0} />
        </mesh>

        {/* Turned Rod Top Cap */}
        <group position={[0, 0.76, 0]}>
          <SvgLathe pathData={LATHE_ROD_TOP_CAP_PROFILE}>
            <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0} />
          </SvgLathe>
        </group>
      </group>

      {/* Bosshead Clamp clamped onto Vertical Rod at Y = 0.32m */}
      <group position={[STAND_X, PIVOT_POS[1], 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.045, 0.045, 0.045]} />
          <meshStandardMaterial color="#475569" roughness={0.85} metalness={0} />
        </mesh>

        {/* Knurled Thumb Screws */}
        <group position={[-0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </SvgLathe>
        </group>
        <group position={[0, 0, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </SvgLathe>
        </group>

        {/* Horizontal Support Arm extending from Vertical Rod to Pivot */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.24, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------------- */}
      {/* 3. SUSPENSION PIVOT COLLAR & PROTRACTOR ARC GAUGE                   */}
      {/* ------------------------------------------------------------------- */}
      <group position={PIVOT_POS}>
        <SvgLathe pathData={LATHE_PROTRACTOR_PIVOT_CAP_PROFILE}>
          <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
        </SvgLathe>

        {/* PhET-Inspired Curved Protractor Arc Gauge */}
        {showProtractor && <ProtractorArc radius={0.20} />}
      </group>

      {/* ------------------------------------------------------------------- */}
      {/* 4. PENDULUM STRING & SCALED CLAY BOB                                */}
      {/* ------------------------------------------------------------------- */}
      <group position={PIVOT_POS}>
        <group rotation={[0, 0, currentAngle]}>
          {/* Pendulum String Line */}
          <mesh position={[0, -visualStringLength / 2, 0]}>
            <cylinderGeometry args={[0.0015, 0.0015, visualStringLength, 16]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>

          {/* Scaled Clay Pendulum Bob */}
          <group position={[0, -visualStringLength, 0]} scale={[bobScale, bobScale, bobScale]}>
            <SvgLathe pathData={LATHE_PENDULUM_BOB_PROFILE}>
              <meshStandardMaterial color="#f59e0b" roughness={0.85} metalness={0} />
            </SvgLathe>

            {/* Top Eyebolt Ring Collar */}
            <mesh position={[0, 0.039, 0]}>
              <torusGeometry args={[0.0055, 0.0016, 16, 24]} />
              <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
            </mesh>
          </group>

          {/* 3D Force & Velocity Vectors (When enabled) */}
          {showEnergyVectors && (
            <group position={[0, -visualStringLength, 0]}>
              {/* Tangential Velocity Arrow (Sky Blue) */}
              <VectorArrow length={velVectorLen} color="#38bdf8" rotation={[0, 0, -Math.PI / 2]} />
              {/* Centripetal Acceleration Arrow (Amber Upward along string) */}
              <VectorArrow length={accVectorLen} color="#f59e0b" rotation={[0, 0, 0]} />
            </group>
          )}
        </group>
      </group>

      {/* ------------------------------------------------------------------- */}
      {/* 5. METER RULE (Mounted vertically beside pendulum)                  */}
      {/* ------------------------------------------------------------------- */}
      {showRuler && <HeroMeterRule lengthM={pendulumLength} position={[0.22, 0.0, -0.02]} />}
    </group>
  );
}

// -----------------------------------------------------------------------------
// DOM OVERLAY COMPONENT (Stagnant, High-Performance, Glassmorphic)
// -----------------------------------------------------------------------------

export function SimpleHarmonicMotionOverlay() {
  const pendulumLength = useSimValue<IValueMap, 'pendulum_length'>('pendulum_length', 0.70);
  const bobMass = useSimValue<IValueMap, 'bob_mass'>('bob_mass', 1.00);
  const initialAngleDeg = useSimValue<IValueMap, 'initial_angle'>('initial_angle', 25);
  const gravityEnv = useSimValue<IValueMap, 'gravity_environment'>('gravity_environment', 'Earth (9.81 m/s²)');
  const customGravity = useSimValue<IValueMap, 'custom_gravity'>('custom_gravity', 9.81);
  const frictionDamping = useSimValue<IValueMap, 'friction_damping'>('friction_damping', 'None (Vacuum)');
  const targetSwings = useSimValue<IValueMap, 'target_swings'>('target_swings', 'Continuous (Free Run)');
  const simSpeed = useSimValue<IValueMap, 'simulation_speed'>('simulation_speed', 'Normal (1.0x)');
  const releasePendulum = useSimValue<IValueMap, 'release_pendulum'>('release_pendulum', false);
  const resetSetup = useSimValue<IValueMap, 'reset_setup'>('reset_setup', false);

  // Gravity constant mapping
  const g = useMemo(() => {
    switch (gravityEnv) {
      case 'Moon (1.62 m/s²)':
        return 1.62;
      case 'Mars (3.72 m/s²)':
        return 3.72;
      case 'Jupiter (24.79 m/s²)':
        return 24.79;
      case 'Zero Gravity (0 m/s²)':
        return 0.0;
      case 'Custom Value':
        return customGravity;
      case 'Earth (9.81 m/s²)':
      default:
        return 9.81;
    }
  }, [gravityEnv, customGravity]);

  // Air resistance damping factor gamma
  const dampingGamma = useMemo(() => {
    switch (frictionDamping) {
      case 'Low (Air)':
        return 0.04;
      case 'Medium':
        return 0.12;
      case 'High':
        return 0.32;
      case 'None (Vacuum)':
      default:
        return 0.0;
    }
  }, [frictionDamping]);

  const maxTargetCycles = useMemo(() => {
    switch (targetSwings) {
      case '5 Swings':
        return 5;
      case '10 Swings (Standard)':
        return 10;
      case '20 Swings':
        return 20;
      case 'Continuous (Free Run)':
      default:
        return Infinity;
    }
  }, [targetSwings]);

  const speedMult = simSpeed === 'Slow Motion (0.5x)' ? 0.5 : simSpeed === 'Quarter Speed (0.25x)' ? 0.25 : 1.0;

  // Theoretical exact period with first-order large angle correction:
  // T = 2*pi*sqrt(L/g) * (1 + 1/16 * theta0^2)
  const theta0Rad = (initialAngleDeg * Math.PI) / 180;
  const theoreticalPeriod = g > 0
    ? 2 * Math.PI * Math.sqrt(pendulumLength / g) * (1 + (1 / 16) * theta0Rad * theta0Rad)
    : Infinity;
  const frequencyHz = theoreticalPeriod !== Infinity ? 1 / theoreticalPeriod : 0;

  // Live timer & cycle measurement state in overlay
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cyclesCount, setCyclesCount] = useState(0);
  const [currentAngleDeg, setCurrentAngleDeg] = useState(initialAngleDeg);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [kineticEnergy, setKineticEnergy] = useState(0);
  const [potentialEnergy, setPotentialEnergy] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const angleSimRef = useRef((initialAngleDeg * Math.PI) / 180);
  const omegaSimRef = useRef(0);
  const prevSignRef = useRef(1);
  const accumulatedTimeRef = useRef(0);

  // Reset or restart timer
  useEffect(() => {
    if (resetSetup || !releasePendulum) {
      const theta0 = (initialAngleDeg * Math.PI) / 180;
      angleSimRef.current = theta0;
      omegaSimRef.current = 0;
      prevSignRef.current = Math.sign(theta0) || 1;
      setCurrentAngleDeg(initialAngleDeg);
      setCurrentSpeed(0);
      setIsCompleted(false);

      const h0 = pendulumLength * (1 - Math.cos(theta0));
      setPotentialEnergy(bobMass * g * h0);
      setKineticEnergy(0);

      if (resetSetup) {
        setElapsedTime(0);
        setCyclesCount(0);
        accumulatedTimeRef.current = 0;
      }
    }
  }, [releasePendulum, resetSetup, initialAngleDeg, pendulumLength, bobMass, g]);

  // High-precision requestAnimationFrame physics loop for the DOM overlay
  useEffect(() => {
    if (!releasePendulum || resetSetup || g === 0) return;

    let animId: number;
    let lastTime = performance.now() / 1000;
    let localCycles = cyclesCount;

    const loop = (nowMs: number) => {
      const now = nowMs / 1000;
      const rawDt = Math.min(now - lastTime, 0.05);
      lastTime = now;

      const dtTotal = rawDt * speedMult;
      accumulatedTimeRef.current += dtTotal;
      setElapsedTime(accumulatedTimeRef.current);

      const subSteps = 8;
      const dt = dtTotal / subSteps;

      let theta = angleSimRef.current;
      let omega = omegaSimRef.current;

      for (let i = 0; i < subSteps; i++) {
        const alpha1 = -(g / pendulumLength) * Math.sin(theta) - (dampingGamma / bobMass) * omega;
        const thetaMid = theta + 0.5 * dt * omega;
        const omegaMid = omega + 0.5 * dt * alpha1;

        const alpha2 = -(g / pendulumLength) * Math.sin(thetaMid) - (dampingGamma / bobMass) * omegaMid;
        theta += dt * omegaMid;
        omega += dt * alpha2;
      }

      angleSimRef.current = theta;
      omegaSimRef.current = omega;
      setCurrentAngleDeg((theta * 180) / Math.PI);

      // Tangential velocity & energy
      const h = pendulumLength * (1 - Math.cos(theta));
      const v = pendulumLength * omega;
      setCurrentSpeed(Math.abs(v));

      const ep = Math.max(0, bobMass * g * h);
      const ek = Math.max(0, 0.5 * bobMass * v * v);
      setPotentialEnergy(ep);
      setKineticEnergy(ek);

      // Detect zero-crossing in positive direction
      const currentSign = Math.sign(theta);
      if (prevSignRef.current < 0 && currentSign >= 0) {
        localCycles += 1;
        setCyclesCount(localCycles);

        if (localCycles >= maxTargetCycles) {
          setIsCompleted(true);
          return; // Stop animation when target reached!
        }
      }
      prevSignRef.current = currentSign;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [releasePendulum, resetSetup, pendulumLength, bobMass, g, dampingGamma, speedMult, maxTargetCycles]);

  const totalEnergy = potentialEnergy + kineticEnergy;
  const ekPct = totalEnergy > 0 ? Math.min(100, Math.max(0, (kineticEnergy / totalEnergy) * 100)) : 0;
  const epPct = 100 - ekPct;

  const measuredPeriod = cyclesCount > 0 ? (elapsedTime / cyclesCount) : null;
  const statusColor = isCompleted ? '#3b82f6' : !releasePendulum ? '#64748b' : '#22c55e';
  const statusText = isCompleted ? 'Target Complete' : !releasePendulum ? 'Ready / Displaced' : 'Oscillating (Active)';

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
      {/* 1. Live Stopwatch & Period Card */}
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
          Lab Stopwatch & Telemetry
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '6px 0 4px' }}>
          <span style={{ fontSize: 30, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 800, lineHeight: 1 }}>
            {elapsedTime.toFixed(2)} s
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Swings (N)</span>
          <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
            {cyclesCount} {maxTargetCycles !== Infinity ? `/ ${maxTargetCycles}` : 'cycles'}
          </span>
        </div>
      </div>

      {/* 2. Motion & Period Calculations Card */}
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
          Period & Kinematics
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Angle (θ)</span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
              {currentAngleDeg.toFixed(1)}°
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Tangential Speed (v)</span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 600 }}>
              {currentSpeed.toFixed(2)} m/s
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Theoretical Period (T₀)</span>
            <span style={{ fontSize: 12, color: '#0284c7', fontFamily: 'system-ui', fontWeight: 700 }}>
              {theoreticalPeriod !== Infinity ? `${theoreticalPeriod.toFixed(3)} s` : '---'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Measured Period (t/N)</span>
            <span style={{ fontSize: 12, color: '#16a34a', fontFamily: 'system-ui', fontWeight: 700 }}>
              {measuredPeriod !== null ? `${measuredPeriod.toFixed(3)} s` : '---'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8ab0d0', fontFamily: 'system-ui' }}>Gravity (g)</span>
            <span style={{ fontSize: 12, color: '#7c3aed', fontFamily: 'system-ui', fontWeight: 600 }}>
              {g.toFixed(2)} m/s²
            </span>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Energy Conservation Card */}
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
          Energy Conservation
        </p>

        {/* Dynamic Energy Bar */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: 6,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            margin: '8px 0 6px',
          }}
        >
          <div
            style={{
              width: `${ekPct}%`,
              backgroundColor: '#22c55e',
              transition: 'width 0.05s linear',
            }}
          />
          <div
            style={{
              width: `${epPct}%`,
              backgroundColor: '#3b82f6',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#3b82f6', fontFamily: 'system-ui', fontWeight: 600 }}>
              ● Potential (Ep)
            </span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 600 }}>
              {potentialEnergy.toFixed(3)} J
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#22c55e', fontFamily: 'system-ui', fontWeight: 600 }}>
              ● Kinetic (Ek)
            </span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 600 }}>
              {kineticEnergy.toFixed(3)} J
            </span>
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(100, 160, 230, 0.2)', margin: '2px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#7a9ec0', fontFamily: 'system-ui', fontWeight: 600 }}>
              Total Energy (E)
            </span>
            <span style={{ fontSize: 12, color: '#1e3a5f', fontFamily: 'system-ui', fontWeight: 700 }}>
              {totalEnergy.toFixed(3)} J
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
