'use client';

import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SvgLathe } from '../../common';
import { useSimValue } from '../../resolver';
import { IValueMap } from './config.v1';

// -----------------------------------------------------------------------------
// REFINED SVG LATHE GEOMETRY PROFILES (Turned Hardware Parts)
// -----------------------------------------------------------------------------

// 1. Turned Electrolytic Capacitor Can Profile
const LATHE_CAPACITOR_CAN_PROFILE =
  'M 0,0.065 L 0.024,0.065 C 0.026,0.062 0.026,0.058 0.024,0.055 L 0.024,-0.005 C 0.022,-0.008 0.018,-0.01 0.012,-0.01 L 0,-0.01 Z';

// 2. Turned Binding Post / Banana Jack Terminal Profile
const LATHE_BINDING_POST_PROFILE =
  'M 0,0.022 L 0.007,0.022 C 0.009,0.018 0.009,0.012 0.006,0.008 L 0.008,0.004 L 0.008,0 L 0,0 Z';

// 3. Turned Multimeter Rotary Knob Profile
const LATHE_METER_KNOB_PROFILE =
  'M 0,0.015 L 0.018,0.015 C 0.02,0.012 0.02,0.006 0.016,0.002 L 0.016,0 L 0,0 Z';

// 4. Turned Test Probe Barrel Profile
const LATHE_PROBE_BARREL_PROFILE =
  'M 0,0.075 L 0.005,0.075 C 0.007,0.055 0.007,0.025 0.004,0.008 L 0.001,0.002 L 0.001,0 L 0,0 Z';

// -----------------------------------------------------------------------------
// SMOOTH 3D SPLINE WIRE COMPONENT
// -----------------------------------------------------------------------------

function SmoothWire({
  points,
  color,
  radius = 0.0035,
}: {
  points: [number, number, number][];
  color: string;
  radius?: number;
}) {
  const curve = useMemo(() => {
    const vPoints = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.CatmullRomCurve3(vPoints, false, 'centripetal', 0.5);
  }, [points]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [curve, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.8} metalness={0} />
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// BENCHTOP DC POWER SUPPLY COMPONENT
// -----------------------------------------------------------------------------

function PowerSupplyUnit({
  position,
  voltage,
  isPowered,
}: {
  position: [number, number, number];
  voltage: number;
  isPowered: boolean;
}) {
  return (
    <group position={position}>
      {/* Main Steel Housing (Matte Slate Clay) */}
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.16, 0.15, 0.18]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0} />
      </mesh>

      {/* Front Beveled Face Plate */}
      <mesh position={[0, 0.075, 0.091]}>
        <boxGeometry args={[0.145, 0.135, 0.004]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0} />
      </mesh>

      {/* Illuminated LED Voltage Display Panel */}
      <mesh position={[0, 0.11, 0.094]}>
        <planeGeometry args={[0.09, 0.04]} />
        <meshBasicMaterial color="#022c22" />
      </mesh>

      <Text
        position={[0, 0.11, 0.095]}
        fontSize={0.018}
        color={isPowered ? '#22c55e' : '#14532d'}
        anchorX="center"
        anchorY="middle"
      >
        {isPowered ? `${voltage.toFixed(1)} V` : '0.0 V'}
      </Text>

      {/* Status LED */}
      <mesh position={[0.05, 0.11, 0.094]}>
        <circleGeometry args={[0.004, 16]} />
        <meshBasicMaterial color={isPowered ? '#22c55e' : '#64748b'} />
      </mesh>

      {/* Red Positive (+) Output Terminal */}
      <group position={[0.035, 0.04, 0.093]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_BINDING_POST_PROFILE}>
          <meshStandardMaterial color="#ef4444" roughness={0.85} metalness={0} />
        </SvgLathe>
      </group>

      {/* Black Negative (-) Ground Terminal */}
      <group position={[-0.035, 0.04, 0.093]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_BINDING_POST_PROFILE}>
          <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0} />
        </SvgLathe>
      </group>

      {/* Terminal Polarity Labels */}
      <Text position={[0.035, 0.06, 0.094]} fontSize={0.012} color="#ef4444" anchorX="center">
        +
      </Text>
      <Text position={[-0.035, 0.06, 0.094]} fontSize={0.014} color="#94a3b8" anchorX="center">
        -
      </Text>
      <Text position={[0, 0.018, 0.094]} fontSize={0.007} color="#94a3b8" anchorX="center">
        DC POWER SUPPLY
      </Text>
    </group>
  );
}

// -----------------------------------------------------------------------------
// DIGITAL MULTIMETER (DMM) COMPONENT
// -----------------------------------------------------------------------------

function DigitalMultimeter({
  position,
  readout,
  modeLabel,
}: {
  position: [number, number, number];
  readout: string;
  modeLabel: string;
}) {
  return (
    <group position={position} rotation={[-0.2, -0.3, 0]}>
      {/* Molded Rugged Case Body (Warm Amber Clay) */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.13, 0.18, 0.045]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.9} metalness={0} />
      </mesh>

      {/* Front Face Inset (Dark Slate) */}
      <mesh position={[0, 0.06, 0.023]}>
        <boxGeometry args={[0.115, 0.165, 0.003]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0} />
      </mesh>

      {/* LCD Screen Display */}
      <mesh position={[0, 0.105, 0.026]}>
        <planeGeometry args={[0.095, 0.045]} />
        <meshBasicMaterial color="#042f2e" />
      </mesh>

      {/* Main Measurement Readout */}
      <Text position={[0, 0.112, 0.027]} fontSize={0.017} color="#2dd4bf" anchorX="center" anchorY="middle">
        {readout}
      </Text>

      {/* Mode Sub-Text on Screen */}
      <Text position={[0, 0.092, 0.027]} fontSize={0.007} color="#5eead4" anchorX="center" anchorY="middle">
        {modeLabel}
      </Text>

      {/* Turned Rotary Selector Knob */}
      <group position={[0, 0.045, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_METER_KNOB_PROFILE}>
          <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0} />
        </SvgLathe>
      </group>

      {/* Jack Inputs (COM & V-Ω) */}
      <group position={[-0.025, 0.005, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_BINDING_POST_PROFILE}>
          <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0} />
        </SvgLathe>
      </group>
      <group position={[0.025, 0.005, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
        <SvgLathe pathData={LATHE_BINDING_POST_PROFILE}>
          <meshStandardMaterial color="#ef4444" roughness={0.85} metalness={0} />
        </SvgLathe>
      </group>

      <Text position={[-0.025, -0.01, 0.026]} fontSize={0.006} color="#94a3b8" anchorX="center">
        COM
      </Text>
      <Text position={[0.025, -0.01, 0.026]} fontSize={0.006} color="#ef4444" anchorX="center">
        V-Ω-C
      </Text>
    </group>
  );
}

// -----------------------------------------------------------------------------
// TURNED CLAY CAPACITOR COMPONENT
// -----------------------------------------------------------------------------

function ClayCapacitor({
  position,
  label,
  value,
  color,
  accentColor,
}: {
  position: [number, number, number];
  label: string;
  value: number;
  color: string;
  accentColor: string;
}) {
  // Scale height and diameter proportionally with capacitance (1–10 µF)
  const scaleFactor = 0.8 + (value / 10) * 0.45;

  return (
    <group position={position}>
      {/* Capacitor Mounting Stand Pad */}
      <mesh position={[0, -0.002, 0]}>
        <cylinderGeometry args={[0.038 * scaleFactor, 0.038 * scaleFactor, 0.004, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} metalness={0} />
      </mesh>

      {/* Main Capacitor Can Body */}
      <group scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <SvgLathe pathData={LATHE_CAPACITOR_CAN_PROFILE} segments={36}>
          <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
        </SvgLathe>

        {/* Polarity / Negative Stripe Band */}
        <mesh position={[0.018, 0.028, 0]}>
          <boxGeometry args={[0.004, 0.055, 0.012]} />
          <meshStandardMaterial color={accentColor} roughness={0.85} metalness={0} />
        </mesh>

        {/* Top Aluminum Vent Score Ring */}
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.002, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      {/* Left Lead Terminal (Positive) */}
      <group position={[-0.045, 0, 0]}>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.016, 16]} />
          <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
        </mesh>
        {/* Connection lead wire to base */}
        <mesh position={[0.02, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.04, 12]} />
          <meshStandardMaterial color="#d4a359" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* Right Lead Terminal (Negative) */}
      <group position={[0.045, 0, 0]}>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.016, 16]} />
          <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
        </mesh>
        {/* Connection lead wire to base */}
        <mesh position={[-0.02, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.04, 12]} />
          <meshStandardMaterial color="#d4a359" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* Clean Engraved Base Label */}
      <Text position={[0, 0.001, 0.055]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.016} color="#1e293b" anchorX="center">
        {`${label} = ${value} µF`}
      </Text>
    </group>
  );
}

// -----------------------------------------------------------------------------
// MAIN CAPACITORS MODEL COMPONENT
// -----------------------------------------------------------------------------

export default function CapacitorsModelV1() {
  const circuitConfig = useSimValue<IValueMap, 'circuit_config'>('circuit_config', 'Series');
  const c1Value = useSimValue<IValueMap, 'c1_value'>('c1_value', 2);
  const c2Value = useSimValue<IValueMap, 'c2_value'>('c2_value', 3);
  const supplyVoltage = useSimValue<IValueMap, 'supply_voltage'>('supply_voltage', 12);
  const probeTarget = useSimValue<IValueMap, 'probe_target'>('probe_target', 'Total Circuit (C_eq)');
  const multimeterMode = useSimValue<IValueMap, 'multimeter_mode'>('multimeter_mode', 'Effective Capacitance');
  const circuitSwitch = useSimValue<IValueMap, 'circuit_switch'>('circuit_switch', true);

  const isSeries = circuitConfig === 'Series';
  const isPowered = circuitSwitch;
  const Vs = isPowered ? supplyVoltage : 0;

  // --------------------------------------------------------------------------
  // Exact Theoretical Network Physics
  // --------------------------------------------------------------------------
  const physics = useMemo(() => {
    const C1 = c1Value;
    const C2 = c2Value;

    if (isSeries) {
      const Ceff = (C1 * C2) / (C1 + C2);
      const Qtotal = Ceff * Vs;
      const Q1 = Qtotal;
      const Q2 = Qtotal;
      const V1 = C1 > 0 ? Q1 / C1 : 0;
      const V2 = C2 > 0 ? Q2 / C2 : 0;
      const Utotal = 0.5 * Ceff * Vs * Vs;
      const U1 = 0.5 * C1 * V1 * V1;
      const U2 = 0.5 * C2 * V2 * V2;
      return { Ceff, Qtotal, Vtotal: Vs, V1, V2, Q1, Q2, Utotal, U1, U2, C1, C2 };
    } else {
      const Ceff = C1 + C2;
      const V1 = Vs;
      const V2 = Vs;
      const Q1 = C1 * V1;
      const Q2 = C2 * V2;
      const Qtotal = Q1 + Q2;
      const Utotal = 0.5 * Ceff * Vs * Vs;
      const U1 = 0.5 * C1 * V1 * V1;
      const U2 = 0.5 * C2 * V2 * V2;
      return { Ceff, Qtotal, Vtotal: Vs, V1, V2, Q1, Q2, Utotal, U1, U2, C1, C2 };
    }
  }, [isSeries, c1Value, c2Value, Vs]);

  // Multimeter Display Value based on active probe target & function mode
  const multimeterReadout = useMemo(() => {
    if (probeTarget === 'Across Capacitor 1 (C1)') {
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return `${physics.C1.toFixed(2)} µF`;
        case 'Potential Difference (Voltage)':
          return `${physics.V1.toFixed(2)} V`;
        case 'Stored Charge (Q)':
          return `${physics.Q1.toFixed(1)} µC`;
        case 'Stored Energy (U)':
          return `${physics.U1.toFixed(1)} µJ`;
      }
    } else if (probeTarget === 'Across Capacitor 2 (C2)') {
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return `${physics.C2.toFixed(2)} µF`;
        case 'Potential Difference (Voltage)':
          return `${physics.V2.toFixed(2)} V`;
        case 'Stored Charge (Q)':
          return `${physics.Q2.toFixed(1)} µC`;
        case 'Stored Energy (U)':
          return `${physics.U2.toFixed(1)} µJ`;
      }
    } else {
      // Total Circuit
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return `${physics.Ceff.toFixed(2)} µF`;
        case 'Potential Difference (Voltage)':
          return `${physics.Vtotal.toFixed(2)} V`;
        case 'Stored Charge (Q)':
          return `${physics.Qtotal.toFixed(1)} µC`;
        case 'Stored Energy (U)':
          return `${physics.Utotal.toFixed(1)} µJ`;
      }
    }
  }, [probeTarget, multimeterMode, physics]);

  // Layout Positions
  const PS_POS: [number, number, number] = [-0.48, 0, 0.05];
  const DMM_POS: [number, number, number] = [0.46, 0, 0.05];

  // Dynamic Component Positions based on Series vs Parallel
  const c1Pos: [number, number, number] = isSeries ? [-0.14, 0.005, 0] : [0.0, 0.005, -0.09];
  const c2Pos: [number, number, number] = isSeries ? [0.14, 0.005, 0] : [0.0, 0.005, 0.09];

  // Terminal Coordinates
  // C1 terminals:
  const c1Left: [number, number, number] = [c1Pos[0] - 0.045, 0.015, c1Pos[2]];
  const c1Right: [number, number, number] = [c1Pos[0] + 0.045, 0.015, c1Pos[2]];

  // C2 terminals:
  const c2Left: [number, number, number] = [c2Pos[0] - 0.045, 0.015, c2Pos[2]];
  const c2Right: [number, number, number] = [c2Pos[0] + 0.045, 0.015, c2Pos[2]];

  // Power supply output posts:
  const psPosTerminal: [number, number, number] = [PS_POS[0] + 0.035, 0.04, PS_POS[2] + 0.093];
  const psNegTerminal: [number, number, number] = [PS_POS[0] - 0.035, 0.04, PS_POS[2] + 0.093];

  // DMM input jack terminals:
  const dmmComJack: [number, number, number] = [DMM_POS[0] - 0.025, 0.01, DMM_POS[2] + 0.03];
  const dmmPosJack: [number, number, number] = [DMM_POS[0] + 0.025, 0.01, DMM_POS[2] + 0.03];

  // Junction Nodes for Parallel Mode:
  const leftJunctionNode: [number, number, number] = [-0.18, 0.005, 0];
  const rightJunctionNode: [number, number, number] = [0.18, 0.005, 0];

  // Multimeter Probe Targets
  const probePositiveTarget: [number, number, number] = useMemo(() => {
    if (probeTarget === 'Across Capacitor 1 (C1)') return [c1Left[0], 0.025, c1Left[2]];
    if (probeTarget === 'Across Capacitor 2 (C2)') return [c2Left[0], 0.025, c2Left[2]];
    return isSeries ? [c1Left[0], 0.025, c1Left[2]] : [leftJunctionNode[0], 0.025, leftJunctionNode[2]];
  }, [probeTarget, isSeries, c1Left, c2Left, leftJunctionNode]);

  const probeNegativeTarget: [number, number, number] = useMemo(() => {
    if (probeTarget === 'Across Capacitor 1 (C1)') return [c1Right[0], 0.025, c1Right[2]];
    if (probeTarget === 'Across Capacitor 2 (C2)') return [c2Right[0], 0.025, c2Right[2]];
    return isSeries ? [c2Right[0], 0.025, c2Right[2]] : [rightJunctionNode[0], 0.025, rightJunctionNode[2]];
  }, [probeTarget, isSeries, c1Right, c2Right, rightJunctionNode]);

  return (
    <group position={[0, -0.06, 0]}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. ACADEMIC LAB BENCHTOP SURFACE                                    */}
      {/* ------------------------------------------------------------------- */}
      {/* Main Table Top Plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.7, 0.04, 0.95]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} metalness={0} />
      </mesh>
      {/* Ceramic Work Surface Mat */}
      <mesh position={[0, -0.029, 0]}>
        <boxGeometry args={[1.65, 0.002, 0.90]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.95} metalness={0} />
      </mesh>

      {/* ------------------------------------------------------------------- */}
      {/* 2. CIRCUIT PLATFORM BOARD (Clear, uncluttered mounting board)       */}
      {/* ------------------------------------------------------------------- */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.56, 0.01, 0.36]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0.0055, 0]}>
        <planeGeometry args={[0.54, 0.34]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} metalness={0} />
      </mesh>

      {/* Mode Title Printed on Board */}
      <Text position={[0, 0.006, -0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.016} color="#64748b" anchorX="center">
        {isSeries ? '● IN-LINE SERIES CAPACITIVE NETWORK' : '● DUAL-BRANCH PARALLEL CAPACITIVE NETWORK'}
      </Text>

      {/* ------------------------------------------------------------------- */}
      {/* 3. BENCHTOP DC POWER SUPPLY UNIT                                    */}
      {/* ------------------------------------------------------------------- */}
      <PowerSupplyUnit position={PS_POS} voltage={supplyVoltage} isPowered={isPowered} />

      {/* ------------------------------------------------------------------- */}
      {/* 4. DIGITAL MULTIMETER (DMM) INSTRUMENT                              */}
      {/* ------------------------------------------------------------------- */}
      <DigitalMultimeter position={DMM_POS} readout={multimeterReadout} modeLabel={multimeterMode} />

      {/* ------------------------------------------------------------------- */}
      {/* 5. TURNED CLAY CAPACITORS C1 & C2                                   */}
      {/* ------------------------------------------------------------------- */}
      <ClayCapacitor
        position={c1Pos}
        label="C₁"
        value={c1Value}
        color="#3b82f6"
        accentColor="#93c5fd"
      />
      <ClayCapacitor
        position={c2Pos}
        label="C₂"
        value={c2Value}
        color="#f59e0b"
        accentColor="#fde047"
      />

      {/* ------------------------------------------------------------------- */}
      {/* 6. CRYSTAL-CLEAR CIRCUIT CONNECTIONS (Series vs Parallel)           */}
      {/* ------------------------------------------------------------------- */}

      {isSeries ? (
        // ----------------- SERIES MODE: SINGLE IN-LINE LOOP ----------------
        <group>
          {/* Positive Feed Wire: PS (+) -> C1 Left */}
          <SmoothWire
            points={[
              psPosTerminal,
              [psPosTerminal[0] + 0.08, 0.06, psPosTerminal[2] - 0.03],
              [-0.24, 0.03, -0.02],
              c1Left,
            ]}
            color="#ef4444"
          />

          {/* Series Connector Bar: C1 Right -> C2 Left (Golden Solid Busbar) */}
          <mesh position={[(c1Right[0] + c2Left[0]) / 2, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.003, 0.003, c2Left[0] - c1Right[0], 12]} />
            <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
          </mesh>

          {/* Negative Return Wire: C2 Right -> PS (-) */}
          <SmoothWire
            points={[
              c2Right,
              [0.26, 0.03, 0.10],
              [-0.10, 0.03, 0.18],
              [psNegTerminal[0] + 0.06, 0.05, psNegTerminal[2] + 0.04],
              psNegTerminal,
            ]}
            color="#0f172a"
          />
        </group>
      ) : (
        // ---------------- PARALLEL MODE: DUAL PARALLEL RUNGS ---------------
        <group>
          {/* Left Branching Junction Node (Golden Post) */}
          <group position={leftJunctionNode}>
            <mesh position={[0, 0.008, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.016, 16]} />
              <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
            </mesh>
          </group>

          {/* Right Merging Junction Node (Golden Post) */}
          <group position={rightJunctionNode}>
            <mesh position={[0, 0.008, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.016, 16]} />
              <meshStandardMaterial color="#d4a359" roughness={0.85} metalness={0} />
            </mesh>
          </group>

          {/* Positive Feed Wire: PS (+) -> Left Junction Node */}
          <SmoothWire
            points={[
              psPosTerminal,
              [psPosTerminal[0] + 0.08, 0.05, psPosTerminal[2] - 0.04],
              [-0.26, 0.03, -0.02],
              [leftJunctionNode[0], 0.015, leftJunctionNode[2]],
            ]}
            color="#ef4444"
          />

          {/* Branch Split 1: Left Node -> C1 Left */}
          <SmoothWire
            points={[
              [leftJunctionNode[0], 0.015, leftJunctionNode[2]],
              [-0.12, 0.02, -0.09],
              c1Left,
            ]}
            color="#ef4444"
          />

          {/* Branch Split 2: Left Node -> C2 Left */}
          <SmoothWire
            points={[
              [leftJunctionNode[0], 0.015, leftJunctionNode[2]],
              [-0.12, 0.02, 0.09],
              c2Left,
            ]}
            color="#ef4444"
          />

          {/* Branch Return 1: C1 Right -> Right Node */}
          <SmoothWire
            points={[
              c1Right,
              [0.12, 0.02, -0.09],
              [rightJunctionNode[0], 0.015, rightJunctionNode[2]],
            ]}
            color="#0f172a"
          />

          {/* Branch Return 2: C2 Right -> Right Node */}
          <SmoothWire
            points={[
              c2Right,
              [0.12, 0.02, 0.09],
              [rightJunctionNode[0], 0.015, rightJunctionNode[2]],
            ]}
            color="#0f172a"
          />

          {/* Negative Return Wire: Right Junction Node -> PS (-) */}
          <SmoothWire
            points={[
              [rightJunctionNode[0], 0.015, rightJunctionNode[2]],
              [0.26, 0.03, 0.12],
              [-0.10, 0.03, 0.18],
              [psNegTerminal[0] + 0.06, 0.05, psNegTerminal[2] + 0.04],
              psNegTerminal,
            ]}
            color="#0f172a"
          />
        </group>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 7. MULTIMETER TEST LEADS & PROBES                                   */}
      {/* ------------------------------------------------------------------- */}
      {/* Red Positive Test Probe & Lead */}
      <group>
        <SmoothWire
          points={[
            dmmPosJack,
            [DMM_POS[0] + 0.05, 0.05, DMM_POS[2] - 0.04],
            [probePositiveTarget[0] + 0.06, 0.08, probePositiveTarget[2] - 0.04],
            [probePositiveTarget[0] + 0.02, 0.06, probePositiveTarget[2]],
            [probePositiveTarget[0], probePositiveTarget[1] + 0.04, probePositiveTarget[2]],
          ]}
          color="#dc2626"
          radius={0.003}
        />
        {/* Red Probe Barrel resting on target */}
        <group
          position={[probePositiveTarget[0], probePositiveTarget[1], probePositiveTarget[2]]}
          rotation={[0.3, 0, 0.2]}
        >
          <SvgLathe pathData={LATHE_PROBE_BARREL_PROFILE}>
            <meshStandardMaterial color="#dc2626" roughness={0.85} metalness={0} />
          </SvgLathe>
        </group>
      </group>

      {/* Black Negative Test Probe & Lead */}
      <group>
        <SmoothWire
          points={[
            dmmComJack,
            [DMM_POS[0] - 0.04, 0.05, DMM_POS[2] + 0.06],
            [probeNegativeTarget[0] + 0.06, 0.08, probeNegativeTarget[2] + 0.04],
            [probeNegativeTarget[0] + 0.02, 0.06, probeNegativeTarget[2]],
            [probeNegativeTarget[0], probeNegativeTarget[1] + 0.04, probeNegativeTarget[2]],
          ]}
          color="#0f172a"
          radius={0.003}
        />
        {/* Black Probe Barrel resting on target */}
        <group
          position={[probeNegativeTarget[0], probeNegativeTarget[1], probeNegativeTarget[2]]}
          rotation={[-0.3, 0, -0.2]}
        >
          <SvgLathe pathData={LATHE_PROBE_BARREL_PROFILE}>
            <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0} />
          </SvgLathe>
        </group>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// DOM OVERLAY COMPONENT (Stagnant, High-Performance, Glassmorphic)
// -----------------------------------------------------------------------------

export function CapacitorsOverlay() {
  const circuitConfig = useSimValue<IValueMap, 'circuit_config'>('circuit_config', 'Series');
  const c1Value = useSimValue<IValueMap, 'c1_value'>('c1_value', 2);
  const c2Value = useSimValue<IValueMap, 'c2_value'>('c2_value', 3);
  const supplyVoltage = useSimValue<IValueMap, 'supply_voltage'>('supply_voltage', 12);
  const probeTarget = useSimValue<IValueMap, 'probe_target'>('probe_target', 'Total Circuit (C_eq)');
  const multimeterMode = useSimValue<IValueMap, 'multimeter_mode'>('multimeter_mode', 'Effective Capacitance');
  const circuitSwitch = useSimValue<IValueMap, 'circuit_switch'>('circuit_switch', true);

  const isSeries = circuitConfig === 'Series';
  const isPowered = circuitSwitch;
  const Vs = isPowered ? supplyVoltage : 0;

  const physics = useMemo(() => {
    const C1 = c1Value;
    const C2 = c2Value;

    if (isSeries) {
      const Ceff = (C1 * C2) / (C1 + C2);
      const Qtotal = Ceff * Vs;
      const Q1 = Qtotal;
      const Q2 = Qtotal;
      const V1 = C1 > 0 ? Q1 / C1 : 0;
      const V2 = C2 > 0 ? Q2 / C2 : 0;
      const Utotal = 0.5 * Ceff * Vs * Vs;
      const U1 = 0.5 * C1 * V1 * V1;
      const U2 = 0.5 * C2 * V2 * V2;
      return { Ceff, Qtotal, Vtotal: Vs, V1, V2, Q1, Q2, Utotal, U1, U2, C1, C2 };
    } else {
      const Ceff = C1 + C2;
      const V1 = Vs;
      const V2 = Vs;
      const Q1 = C1 * V1;
      const Q2 = C2 * V2;
      const Qtotal = Q1 + Q2;
      const Utotal = 0.5 * Ceff * Vs * Vs;
      const U1 = 0.5 * C1 * V1 * V1;
      const U2 = 0.5 * C2 * V2 * V2;
      return { Ceff, Qtotal, Vtotal: Vs, V1, V2, Q1, Q2, Utotal, U1, U2, C1, C2 };
    }
  }, [isSeries, c1Value, c2Value, Vs]);

  const activeReadout = useMemo(() => {
    if (probeTarget === 'Across Capacitor 1 (C1)') {
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return { val: physics.C1.toFixed(2), unit: 'µF', name: 'Capacitance C₁' };
        case 'Potential Difference (Voltage)':
          return { val: physics.V1.toFixed(2), unit: 'V', name: 'Voltage V₁' };
        case 'Stored Charge (Q)':
          return { val: physics.Q1.toFixed(1), unit: 'µC', name: 'Charge Q₁' };
        case 'Stored Energy (U)':
          return { val: physics.U1.toFixed(1), unit: 'µJ', name: 'Energy U₁' };
      }
    } else if (probeTarget === 'Across Capacitor 2 (C2)') {
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return { val: physics.C2.toFixed(2), unit: 'µF', name: 'Capacitance C₂' };
        case 'Potential Difference (Voltage)':
          return { val: physics.V2.toFixed(2), unit: 'V', name: 'Voltage V₂' };
        case 'Stored Charge (Q)':
          return { val: physics.Q2.toFixed(1), unit: 'µC', name: 'Charge Q₂' };
        case 'Stored Energy (U)':
          return { val: physics.U2.toFixed(1), unit: 'µJ', name: 'Energy U₂' };
      }
    } else {
      switch (multimeterMode) {
        case 'Effective Capacitance':
          return { val: physics.Ceff.toFixed(2), unit: 'µF', name: 'Equivalent C_eq' };
        case 'Potential Difference (Voltage)':
          return { val: physics.Vtotal.toFixed(2), unit: 'V', name: 'Total Voltage V_s' };
        case 'Stored Charge (Q)':
          return { val: physics.Qtotal.toFixed(1), unit: 'µC', name: 'Total Charge Q_total' };
        case 'Stored Energy (U)':
          return { val: physics.Utotal.toFixed(1), unit: 'µJ', name: 'Total Energy U_total' };
      }
    }
  }, [probeTarget, multimeterMode, physics]);

  return (
    <div className="absolute left-6 bottom-6 z-50 pointer-events-none flex flex-col gap-2.5 w-60">
      {/* 1. Multimeter Live Telemetry Card */}
      <div className="bg-[#f4f8ff]/95 border border-[#64a0e6]/35 rounded-[14px] px-[18px] py-3.5 backdrop-blur-md">
        <p className="m-0 text-[10px] text-[#7a9ec0] font-semibold tracking-[0.08em] uppercase">
          Digital Multimeter Readout
        </p>
        <div className="flex items-baseline gap-2 mt-1.5 mb-1">
          <span className="text-[30px] text-[#1e3a5f] font-extrabold leading-none tabular-nums">
            {activeReadout.val}
          </span>
          <span className="text-base text-[#0284c7] font-bold">
            {activeReadout.unit}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] text-[#8ab0d0]">Probe Target</span>
          <span className="text-[10px] text-[#0369a1] font-bold bg-[#e0f2fe] px-1.75 py-0.5 rounded-md">
            {probeTarget.replace(/ \(.+\)/, '')}
          </span>
        </div>
      </div>

      {/* 2. Circuit Formulas & Equivalent Calculations Card */}
      <div className="bg-[#f4f8ff]/95 border border-[#64a0e6]/35 rounded-[14px] px-[18px] py-3.5 backdrop-blur-md">
        <p className="m-0 text-[10px] text-[#7a9ec0] font-semibold tracking-[0.08em] uppercase">
          {isSeries ? 'Series Equivalent Formula' : 'Parallel Equivalent Formula'}
        </p>

        <div className="my-1.5 px-2.5 py-1.5 bg-[#f1f5f9] rounded-lg text-xs font-mono font-bold text-[#1e293b]">
          {isSeries
            ? `1/C_eq = 1/${c1Value} + 1/${c2Value}`
            : `C_eq = ${c1Value} + ${c2Value}`}
        </div>

        <div className="flex flex-col gap-1.25 mt-1">
          <div className="flex justify-between gap-3">
            <span className="text-[11px] text-[#8ab0d0]">Equivalent C_eq</span>
            <span className="text-xs text-[#0284c7] font-bold tabular-nums">
              {physics.Ceff.toFixed(2)} µF
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[11px] text-[#8ab0d0]">Total Stored Q</span>
            <span className="text-xs text-[#16a34a] font-bold tabular-nums">
              {physics.Qtotal.toFixed(1)} µC
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[11px] text-[#8ab0d0]">Total Energy U</span>
            <span className="text-xs text-[#7c3aed] font-bold tabular-nums">
              {physics.Utotal.toFixed(1)} µJ
            </span>
          </div>
        </div>
      </div>

      {/* 3. Individual Capacitor Breakdown Card */}
      <div className="bg-[#f4f8ff]/95 border border-[#64a0e6]/35 rounded-[14px] px-[18px] py-3.5 backdrop-blur-md">
        <p className="m-0 text-[10px] text-[#7a9ec0] font-semibold tracking-[0.08em] uppercase">
          Branch & Component Values
        </p>
        <div className="flex flex-col gap-1.5 mt-1.5">
          {/* C1 row */}
          <div className="px-2 py-1.5 rounded-lg bg-[rgba(59,130,246,0.08)] border-l-[3px] border-l-[#3b82f6]">
            <div className="flex justify-between">
              <span className="text-[11px] text-[#1e3a5f] font-bold">
                C₁ ({c1Value} µF)
              </span>
              <span className="text-[11px] text-[#2563eb] font-bold tabular-nums">
                {physics.V1.toFixed(2)} V | {physics.Q1.toFixed(1)} µC
              </span>
            </div>
          </div>

          {/* C2 row */}
          <div className="px-2 py-1.5 rounded-lg bg-[rgba(245,158,11,0.08)] border-l-[3px] border-l-[#f59e0b]">
            <div className="flex justify-between">
              <span className="text-[11px] text-[#1e3a5f] font-bold">
                C₂ ({c2Value} µF)
              </span>
              <span className="text-[11px] text-[#d97706] font-bold tabular-nums">
                {physics.V2.toFixed(2)} V | {physics.Q2.toFixed(1)} µC
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
