'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v0';

// -----------------------------------------------------------------------------
// REFINED SVG LATHE GEOMETRY PROFILES (High Definition Turned Hardware Parts)
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

// 5. Turned Digital Stopwatch Metallic Crown Push-Button Profile
const LATHE_STOPWATCH_BUTTON_PROFILE =
  'M 0,0.014 L 0.007,0.014 L 0.007,0.009 C 0.008,0.007 0.005,0.004 0.004,0.002 L 0.004,0 Z';

// 6. Turned Suspension Pivot Sleeve Collar Profile
const LATHE_PROTRACTOR_PIVOT_CAP_PROFILE =
  'M 0,0.016 L 0.013,0.016 C 0.015,0.011 0.011,0.006 0.006,0.003 L 0.006,0 Z';

// -----------------------------------------------------------------------------
// 3D METER RULE COMPONENT (Using GSAP utils.mapRange for indicator placement)
// -----------------------------------------------------------------------------

function HeroMeterRule({ lengthM, position }: { lengthM: number; position: [number, number, number] }) {
  const ticks = useMemo(() => {
    const list: { pos: number; label?: string; isMajor: boolean }[] = [];
    for (let cm = 0; cm <= 100; cm += 5) {
      const pos = gsap.utils.mapRange(0, 100, 0.32, -0.32, cm);
      const isMajor = cm % 20 === 0;
      const isMedium = cm % 10 === 0;
      list.push({
        pos,
        label: isMajor ? `${cm}` : undefined,
        isMajor: isMedium,
      });
    }
    return list;
  }, []);

  // Use GSAP mapRange utility for precise red length indicator position
  const visualLen = gsap.utils.mapRange(0.1, 2.0, 0.12, 0.60, lengthM);
  const indicatorY = 0.32 - visualLen;

  return (
    <group position={position}>
      {/* Wood Rule Main Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.038, 0.68, 0.009]} />
        <meshStandardMaterial color="#d97706" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Front Bevel Surface Plate */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.035, 0.67, 0.001]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.3} />
      </mesh>

      {/* Graduation Ticks & Numeric Labels */}
      {ticks.map((tick, idx) => (
        <group key={idx} position={[-0.009, tick.pos, 0.0056]}>
          {/* Tick Line */}
          <mesh position={[tick.isMajor ? 0 : 0.003, 0, 0]}>
            <boxGeometry args={[tick.isMajor ? 0.015 : 0.008, 0.0018, 0.0005]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>

          {/* Centimeter Text Label */}
          {tick.label && (
            <Text
              position={[-0.012, 0, 0]}
              fontSize={0.013}
              color="#0f172a"
              anchorX="right"
              anchorY="middle"
            >
              {tick.label}
            </Text>
          )}
        </group>
      ))}

      {/* Top and Bottom Brass Mounting Clips */}
      {[-0.30, 0.30].map((yClip, i) => (
        <group key={i} position={[-0.022, yClip, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
          </SvgLathe>
        </group>
      ))}

      {/* Dynamic Red String Length Indicator Pointer */}
      <group position={[0, indicatorY, 0.006]}>
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.038, 0.003, 0.002]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Text
          position={[0.024, 0, 0]}
          fontSize={0.015}
          color="#dc2626"
          anchorX="left"
          anchorY="middle"
        >
          {`${lengthM.toFixed(2)} m`}
        </Text>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// DIGITAL LAB STOPWATCH UNIT (Floating Billboard HUD Display)
// -----------------------------------------------------------------------------

function DigitalStopwatch({
  elapsedSeconds,
  cyclesCount,
  measuredPeriod,
  calculatedG,
}: {
  elapsedSeconds: number;
  cyclesCount: number;
  measuredPeriod: number | null;
  calculatedG: number | null;
}) {
  return (
    <Billboard position={[0.38, -0.15, 0.20]} follow lockX={false} lockY={false}>
      {/* Stopwatch ABS Housing Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.125, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Stopwatch Bevel Border */}
      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.165, 0.11, 0.002]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Glowing Digital Screen Panel */}
      <mesh position={[0, 0.01, 0.0125]}>
        <planeGeometry args={[0.15, 0.075]} />
        <meshBasicMaterial color="#022c22" />
      </mesh>

      {/* Turned Metallic Crown Push Buttons (Start/Stop & Reset) */}
      <group position={[-0.05, 0.067, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_STOPWATCH_BUTTON_PROFILE}>
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </SvgLathe>
      </group>
      <group position={[0.05, 0.067, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_STOPWATCH_BUTTON_PROFILE}>
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
        </SvgLathe>
      </group>

      {/* Digital LED Screen Text Outputs */}
      <group position={[0, 0.01, 0.013]}>
        {/* Main Elapsed Time Readout */}
        <Text
          position={[0, 0.018, 0]}
          fontSize={0.024}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          {`${elapsedSeconds.toFixed(2)} s`}
        </Text>

        {/* Oscillations Cycle Count Readout */}
        <Text
          position={[-0.062, -0.01, 0]}
          fontSize={0.011}
          color="#86efac"
          anchorX="left"
          anchorY="middle"
        >
          {`N: ${cyclesCount} / 10`}
        </Text>

        {/* Calculated Period (T = t / 10) */}
        <Text
          position={[0.062, -0.01, 0]}
          fontSize={0.011}
          color="#86efac"
          anchorX="right"
          anchorY="middle"
        >
          {measuredPeriod !== null ? `T: ${measuredPeriod.toFixed(3)}s` : 'T: ---'}
        </Text>

        {/* Calculated Acceleration due to Gravity g */}
        <Text
          position={[0, -0.026, 0]}
          fontSize={0.010}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
        >
          {calculatedG !== null ? `g_exp: ${calculatedG.toFixed(2)} m/s²` : 'g: 9.81 m/s²'}
        </Text>
      </group>

      {/* Header Label on Device Body */}
      <Text
        position={[0, -0.048, 0.011]}
        fontSize={0.009}
        color={measuredPeriod !== null ? "#86efac" : "#cbd5e1"}
        anchorX="center"
        anchorY="middle"
      >
        {measuredPeriod !== null ? "✓ 10 CYCLES MEASURED — COMPLETE" : "PRECISION LAB TIMER"}
      </Text>
    </Billboard>
  );
}

// -----------------------------------------------------------------------------
// MAIN SIMPLE HARMONIC MOTION MODEL COMPONENT
// -----------------------------------------------------------------------------

export default function SimpleHarmonicMotionModel() {
  // Central State Controls
  const pendulumLength = useSimValue<IValueMap, 'pendulum_length'>('pendulum_length', 0.5);
  const releasePendulum = useSimValue<IValueMap, 'release_pendulum'>('release_pendulum', false);
  const resetSetup = useSimValue<IValueMap, 'reset_setup'>('reset_setup', false);

  // Physical Constants & True SHM Physics Equations
  const gReal = 9.81; // m/s^2 acceleration due to gravity
  const omega = Math.sqrt(gReal / pendulumLength);

  // Dynamic State Variables
  const [currentAngle, setCurrentAngle] = useState(0); // Radian angle θ
  const [elapsedTime, setElapsedTime] = useState(0); // Stopwatch time t
  const [cyclesCount, setCyclesCount] = useState(0); // Oscillation count N
  const [measuredPeriod, setMeasuredPeriod] = useState<number | null>(null);
  const [calculatedG, setCalculatedG] = useState<number | null>(null);

  const prevAngleSignRef = useRef<number>(0);
  const initialReleaseTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // Handle Release and Reset Toggles
  useEffect(() => {
    if (resetSetup || !releasePendulum) {
      setCurrentAngle(resetSetup ? 0 : (5 * Math.PI) / 180); // Default 5° offset when resting/ready
      setElapsedTime(0);
      setCyclesCount(0);
      setMeasuredPeriod(null);
      setCalculatedG(null);
      prevAngleSignRef.current = 0;
      isRunningRef.current = false;
    } else if (releasePendulum && !resetSetup) {
      initialReleaseTimeRef.current = performance.now() / 1000;
      isRunningRef.current = true;
    }
  }, [releasePendulum, resetSetup, pendulumLength]);

  // Physics Integration & Animation Loop (Simplified with GSAP utils interpolate)
  useFrame(() => {
    if (!releasePendulum) {
      if (!resetSetup) {
        setCurrentAngle((5 * Math.PI) / 180);
      } else {
        setCurrentAngle(0);
      }
      return;
    }

    // When 10 oscillations complete, use GSAP interpolate (spring lerp) to rest angle 0
    if (!isRunningRef.current) {
      setCurrentAngle((prev) => gsap.utils.interpolate(prev, 0, 0.1));
      return;
    }

    // Update Stopwatch Elapsed Time
    const t = performance.now() / 1000 - initialReleaseTimeRef.current;
    setElapsedTime(t);

    // Calculate SHM Angle: θ(t) = θ_0 * cos(ω * t)
    const initialAngleRad = (5 * Math.PI) / 180; // 5 degrees small angle SHM
    const angle = initialAngleRad * Math.cos(omega * t);
    setCurrentAngle(angle);

    // Count Oscillations: Detect zero-crossings in positive direction to count full cycles
    const currentSign = Math.sign(angle);
    if (prevAngleSignRef.current < 0 && currentSign >= 0) {
      const nextCount = cyclesCount + 1;
      setCyclesCount(nextCount);

      if (nextCount >= 10) {
        // Lock timer and calculate results at 10th oscillation
        const t10 = t;
        const Texp = t10 / 10;
        const gExp = (4 * Math.PI * Math.PI * pendulumLength) / (Texp * Texp);
        setElapsedTime(t10);
        setMeasuredPeriod(Texp);
        setCalculatedG(gExp);
        isRunningRef.current = false; // Freeze simulation & timer!
      }
    }
    prevAngleSignRef.current = currentSign;
  });

  // Hero Layout Origins
  const PIVOT_POS: [number, number, number] = [0, 0.32, 0];
  const STAND_X = -0.22;

  // Proportional Visual String Length mapping simplified using GSAP mapRange utility
  const visualStringLength = gsap.utils.mapRange(0.1, 2.0, 0.12, 0.60, pendulumLength);

  // Calculate 3D Position of Pendulum Bob
  const bobX = PIVOT_POS[0] + Math.sin(currentAngle) * visualStringLength;
  const bobY = PIVOT_POS[1] - Math.cos(currentAngle) * visualStringLength;
  const bobZ = PIVOT_POS[2];

  return (
    <group position={[0, 0, 0]}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. ACADEMIC LAB WORKBENCH TABLE SURFACE                             */}
      {/* ------------------------------------------------------------------- */}
      {/* Table Top Plate */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.7, 0.035, 0.95]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Table Top Ceramic Work Surface Mat */}
      <mesh position={[0, -0.401, 0]}>
        <boxGeometry args={[1.66, 0.002, 0.91]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
      </mesh>

      {/* ------------------------------------------------------------------- */}
      {/* 2. COHESIVE INTEGRATED RETORT STAND ASSEMBLY                        */}
      {/* ------------------------------------------------------------------- */}
      {/* Heavy Cast Iron Base Plate sitting flat on the Bench */}
      <group position={[STAND_X, -0.385, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.025, 0.18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.5} />
        </mesh>

        {/* Turned Rubber Base Support Feet */}
        {[
          [-0.10, -0.06],
          [0.10, -0.06],
          [-0.10, 0.06],
          [0.10, 0.06],
        ].map(([fx, fz], idx) => (
          <SvgLathe key={idx} pathData={LATHE_STAND_FOOT_PROFILE} position={[fx, -0.013, fz]}>
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </SvgLathe>
        ))}

        {/* Stainless Steel Vertical Rod rising straight from Base */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.76, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Turned Rod Top Cap */}
        <group position={[0, 0.76, 0]}>
          <SvgLathe pathData={LATHE_ROD_TOP_CAP_PROFILE}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </SvgLathe>
        </group>
      </group>

      {/* Bosshead Clamp clamped onto Vertical Rod at Y = 0.32m */}
      <group position={[STAND_X, PIVOT_POS[1], 0]}>
        {/* Bosshead Clamp Main Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.045, 0.045, 0.045]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Bosshead Knurled Thumb Screws */}
        <group position={[-0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.15} />
          </SvgLathe>
        </group>
        <group position={[0, 0, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <SvgLathe pathData={LATHE_BOSSHEAD_KNOB_PROFILE}>
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.15} />
          </SvgLathe>
        </group>

        {/* Horizontal Support Arm extending from Vertical Rod (X=-0.22) to Pivot (X=0) */}
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.22, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------------- */}
      {/* 3. SUSPENSION PIVOT COLLAR                                          */}
      {/* ------------------------------------------------------------------- */}
      <SvgLathe pathData={LATHE_PROTRACTOR_PIVOT_CAP_PROFILE} position={PIVOT_POS}>
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.15} />
      </SvgLathe>

      {/* ------------------------------------------------------------------- */}
      {/* 4. PENDULUM STRING & HIGH-DEF TURNED BRASS BOB                       */}
      {/* ------------------------------------------------------------------- */}
      <group position={PIVOT_POS}>
        <group rotation={[0, 0, currentAngle]}>
          {/* Pendulum String Line */}
          <mesh position={[0, -visualStringLength / 2, 0]}>
            <cylinderGeometry args={[0.0015, 0.0015, visualStringLength, 16]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>

          {/* High Definition Turned Brass Pendulum Bob */}
          <group position={[0, -visualStringLength, 0]}>
            <SvgLathe pathData={LATHE_PENDULUM_BOB_PROFILE}>
              <meshStandardMaterial color="#f59e0b" metalness={0.88} roughness={0.12} />
            </SvgLathe>

            {/* Top Eyebolt Ring Collar */}
            <mesh position={[0, 0.039, 0]}>
              <torusGeometry args={[0.0055, 0.0016, 16, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Floating Dynamic Angle Badge */}
      <Billboard position={[bobX + 0.08, bobY, bobZ]} follow lockX={false} lockY={false}>
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[0.12, 0.03]} />
          <meshBasicMaterial color="#0f172a" opacity={0.85} transparent />
        </mesh>
        <Text fontSize={0.013} color="#f8fafc" anchorX="center" anchorY="middle">
          {`θ: ${((currentAngle * 180) / Math.PI).toFixed(1)}°`}
        </Text>
      </Billboard>

      {/* ------------------------------------------------------------------- */}
      {/* 5. HERO METER RULE (Mounted vertically beside pendulum)             */}
      {/* ------------------------------------------------------------------- */}
      <HeroMeterRule lengthM={pendulumLength} position={[0.15, 0.0, -0.02]} />

      {/* ------------------------------------------------------------------- */}
      {/* 6. DIGITAL LAB STOPWATCH UNIT (Sitting on Bench Surface)            */}
      {/* ------------------------------------------------------------------- */}
      <DigitalStopwatch
        elapsedSeconds={elapsedTime}
        cyclesCount={cyclesCount}
        measuredPeriod={measuredPeriod}
        calculatedG={calculatedG}
      />
    </group>
  );
}
