'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSimValue } from '../../resolver';
import { IValueMap } from './index';

// Standard Regulated Benchtop DC Power Supply Voltage
const SOURCE_VOLTAGE = 12.0;

export default function CapacitorsModel() {
  const circuitConfig = useSimValue<IValueMap, 'circuit_config'>('circuit_config', 'Series');
  const c1Value = useSimValue<IValueMap, 'c1_value'>('c1_value', 2);
  const c2Value = useSimValue<IValueMap, 'c2_value'>('c2_value', 3);
  const multimeterMode = useSimValue<IValueMap, 'multimeter_mode'>('multimeter_mode', 'Effective Capacitance');

  const isSeries = circuitConfig === 'Series';

  // --------------------------------------------------------------------------
  // Exact Physics Calculations for Capacitive Network
  // --------------------------------------------------------------------------
  const physics = useMemo(() => {
    const C1 = c1Value; // in µF
    const C2 = c2Value; // in µF
    const Vs = SOURCE_VOLTAGE;

    if (isSeries) {
      const Ceff = (C1 * C2) / (C1 + C2);
      const Qtotal = Ceff * Vs; // in µC
      const Q1 = Qtotal;
      const Q2 = Qtotal;
      const V1 = Q1 / C1;
      const V2 = Q2 / C2;
      const Vtotal = Vs;
      return { Ceff, Qtotal, Vtotal, V1, V2, Q1, Q2, C1, C2 };
    } else {
      const Ceff = C1 + C2;
      const V1 = Vs;
      const V2 = Vs;
      const Q1 = C1 * V1;
      const Q2 = C2 * V2;
      const Qtotal = Q1 + Q2;
      const Vtotal = Vs;
      return { Ceff, Qtotal, Vtotal, V1, V2, Q1, Q2, C1, C2 };
    }
  }, [isSeries, c1Value, c2Value]);

  // Multimeter Display Text Readout
  const multimeterReadout = useMemo(() => {
    if (multimeterMode === 'Effective Capacitance') {
      return `${physics.Ceff.toFixed(2)} µF`;
    } else if (multimeterMode === 'Potential Difference') {
      return `${physics.Vtotal.toFixed(2)} V`;
    } else {
      return `${physics.Qtotal.toFixed(1)} µC`;
    }
  }, [multimeterMode, physics]);

  return (
    <group position={[0, -0.15, 0]} scale={[2.5, 2.5, 2.5]}>
      {/* 1. Academic Lab Benchtop Surface Mat */}
      <WorkbenchSurfaceMat />

      {/* 2. Centered Academic Breadboard Unit */}
      <ExtrudedBreadboardChassis />

      {/* 3. Top-Left Benchtop DC Power Supply Unit */}
      <ExtrudedPowerSupplyUnit voltage={SOURCE_VOLTAGE} />

      {/* 4. Top-Right Digital Multimeter (DMM) Instrument */}
      <ExtrudedMultimeterUnit readout={multimeterReadout} mode={multimeterMode} />

      {/* 5. Programmatically Lathed Capacitors C1 & C2 */}
      <CapacitorComponent
        id="C1"
        label="Capacitor C1"
        value={c1Value}
        voltage={physics.V1}
        charge={physics.Q1}
        color="#1d4ed8"
        accentColor="#93c5fd"
        isSeries={isSeries}
      />
      <CapacitorComponent
        id="C2"
        label="Capacitor C2"
        value={c2Value}
        voltage={physics.V2}
        charge={physics.Q2}
        color="#b45309"
        accentColor="#fde047"
        isSeries={isSeries}
      />

      {/* 6. Realistic Spline Wires & Test Probes */}
      <NeatWireHarness isSeries={isSeries} />

      {/* 7. Live Current/Charge Flow Particles */}
      <AnimatedChargeParticles isSeries={isSeries} />
    </group>
  );
}

// ============================================================================
// WORKBENCH & CHASSIS COMPONENTS (COMPACT & HERO FRAMED)
// ============================================================================

/**
 * Academic Workbench Surface Mat
 * Provides a clean slate-grey insulating bench plate to anchor all lab instruments.
 */
function WorkbenchSurfaceMat() {
  const shape = useMemo(() => {
    const w = 0.68;
    const d = 0.44;
    const r = 0.02;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -d / 2);
    s.lineTo(w / 2 - r, -d / 2);
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    s.lineTo(w / 2, d / 2 - r);
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    s.lineTo(-w / 2 + r, d / 2);
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    s.lineTo(-w / 2, -d / 2 + r);
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    return s;
  }, []);

  const geom = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.003,
      bevelThickness: 0.003,
    };
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.rotateX(Math.PI / 2);
    return g;
  }, [shape]);

  return (
    <group position={[0, -0.01, 0]}>
      <mesh geometry={geom} receiveShadow>
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Grid Border Accent */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.64, 0.40]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Solderless Breadboard Unit (Matches user's reference image MB-102)
 * Ivory plastic body with interlocking side dovetail tabs, center recessed trough,
 * dual outer power rails (Red + / Blue -), 30 numbered rows (1-30), and column labels (a-e, f-j).
 */
function ExtrudedBreadboardChassis() {
  const width = 0.22;
  const depth = 0.38;
  const height = 0.016;

  // Breadboard Body Shape with Interlocking Dovetail Tabs
  const chassisGeometry = useMemo(() => {
    const r = 0.008;
    const w2 = width / 2;
    const d2 = depth / 2;
    const shape = new THREE.Shape();

    // Main rounded rectangle with side interlocking tabs (dovetail notches)
    shape.moveTo(-w2 + r, -d2);
    shape.lineTo(w2 - r, -d2);
    shape.quadraticCurveTo(w2, -d2, w2, -d2 + r);

    // Right edge
    shape.lineTo(w2, d2 - r);
    shape.quadraticCurveTo(w2, d2, w2 - r, d2);

    // Top edge
    shape.lineTo(-w2 + r, d2);
    shape.quadraticCurveTo(-w2, d2, -w2, d2 - r);

    // Left edge with interlocking tabs
    shape.lineTo(-w2, 0.06);
    shape.lineTo(-w2 - 0.004, 0.055);
    shape.lineTo(-w2 - 0.004, 0.035);
    shape.lineTo(-w2, 0.03);

    shape.lineTo(-w2, -0.03);
    shape.lineTo(-w2 - 0.004, -0.035);
    shape.lineTo(-w2 - 0.004, -0.055);
    shape.lineTo(-w2, -0.06);

    shape.lineTo(-w2, -d2 + r);
    shape.quadraticCurveTo(-w2, -d2, -w2 + r, -d2);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(Math.PI / 2); // Lay flat on lab bench
    return geom;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Molded Ivory Breadboard Body */}
      <mesh geometry={chassisGeometry} receiveShadow castShadow position={[0, height / 2, 0]}>
        <meshStandardMaterial color="#fafafa" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* 2. Socket Top Surface Plate */}
      <mesh position={[0, height + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.008, depth - 0.008]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* 3. Center Recessed Trough Channel (Divides Left & Right Socket Banks) */}
      <mesh position={[0, height + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.006, depth - 0.016]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* 4. Left & Right Power Bus Rails (Red + & Blue - Lines) */}
      {/* Left Power Rail */}
      <mesh position={[-width * 0.44, height + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.002, depth - 0.03]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>
      <mesh position={[-width * 0.35, height + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.002, depth - 0.03]} />
        <meshStandardMaterial color="#2563eb" roughness={0.2} />
      </mesh>

      {/* Right Power Rail */}
      <mesh position={[width * 0.35, height + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.002, depth - 0.03]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>
      <mesh position={[width * 0.44, height + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.002, depth - 0.03]} />
        <meshStandardMaterial color="#2563eb" roughness={0.2} />
      </mesh>

      {/* 5. Power Rail Symbol Indicators (+ Red / - Blue) */}
      <Text position={[-width * 0.44, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#ef4444" anchorX="center">
        +
      </Text>
      <Text position={[-width * 0.35, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#2563eb" anchorX="center">
        -
      </Text>
      <Text position={[-width * 0.44, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#ef4444" anchorX="center">
        +
      </Text>
      <Text position={[-width * 0.35, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#2563eb" anchorX="center">
        -
      </Text>

      <Text position={[width * 0.35, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#ef4444" anchorX="center">
        +
      </Text>
      <Text position={[width * 0.44, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#2563eb" anchorX="center">
        -
      </Text>
      <Text position={[width * 0.35, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#ef4444" anchorX="center">
        +
      </Text>
      <Text position={[width * 0.44, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.011} color="#2563eb" anchorX="center">
        -
      </Text>

      {/* 6. Column Labels (a b c d e) and (f g h i j) */}
      <Text position={[-width * 0.18, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.009} color="#334155">
        a   b   c   d   e
      </Text>
      <Text position={[width * 0.18, height + 0.003, -depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.009} color="#334155">
        f   g   h   i   j
      </Text>
      <Text position={[-width * 0.18, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.009} color="#334155">
        a   b   c   d   e
      </Text>
      <Text position={[width * 0.18, height + 0.003, depth * 0.46]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.009} color="#334155">
        f   g   h   i   j
      </Text>

      {/* 7. Matrix Array of Dark Socket Holes & Row Numbers 1-30 */}
      <BreadboardSocketMatrix height={height} depth={depth} width={width} />
    </group>
  );
}

/**
 * Procedural 3D Pin Socket Matrix & Row Numbers (Matching MB-102 Reference)
 */
function BreadboardSocketMatrix({ height, depth, width }: { height: number; depth: number; width: number }) {
  const rowElements = useMemo(() => {
    const items: React.ReactNode[] = [];
    const numRows = 15; // 15 row markers spaced along breadboard length
    const startZ = -depth * 0.41;
    const endZ = depth * 0.41;
    const stepZ = (endZ - startZ) / (numRows - 1);

    for (let r = 0; r < numRows; r++) {
      const z = startZ + r * stepZ;
      const rowNum = (r * 2 + 1).toString();

      // Row Number Label along center trough
      items.push(
        <Text
          key={`row-num-${r}`}
          position={[0, height + 0.003, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.006}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          {rowNum}
        </Text>
      );

      // Left Bank Socket Hole Rows (5 holes a-e)
      for (let c = 0; c < 5; c++) {
        const x = -width * 0.28 + c * 0.008;
        items.push(
          <mesh key={`hole-l-${r}-${c}`} position={[x, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.004, 0.004]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        );
      }

      // Right Bank Socket Hole Rows (5 holes f-j)
      for (let c = 0; c < 5; c++) {
        const x = width * 0.08 + c * 0.008;
        items.push(
          <mesh key={`hole-r-${r}-${c}`} position={[x, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.004, 0.004]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        );
      }

      // Left Power Bus Rail Holes
      items.push(
        <mesh key={`pwr-l1-${r}`} position={[-width * 0.44, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.0035, 0.0035]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      );
      items.push(
        <mesh key={`pwr-l2-${r}`} position={[-width * 0.35, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.0035, 0.0035]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      );

      // Right Power Bus Rail Holes
      items.push(
        <mesh key={`pwr-r1-${r}`} position={[width * 0.35, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.0035, 0.0035]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      );
      items.push(
        <mesh key={`pwr-r2-${r}`} position={[width * 0.44, height + 0.0009, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.0035, 0.0035]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      );
    }

    return items;
  }, [depth, height, width]);

  return <group>{rowElements}</group>;
}

/**
 * Benchtop DC Power Supply Unit (Matches user's reference image)
 * Deep slate-blue tower cabinet, light silver-grey front bezel collar,
 * dual digital LED meter screen, blue/green/red rotary adjustment knobs, and output terminals.
 */
function ExtrudedPowerSupplyUnit({ voltage }: { voltage: number }) {
  const width = 0.096;
  const height = 0.132;
  const depth = 0.165;

  // Main Deep Cabinet Body (Slate-Blue Metallic)
  const chassisGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.003,
      bevelThickness: 0.003,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Light Silver-Grey Front Bezel Frame Collar
  const bezelGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 - 0.003, -0.003);
    shape.lineTo(width / 2 + 0.003, -0.003);
    shape.lineTo(width / 2 + 0.003, height + 0.003);
    shape.lineTo(-width / 2 - 0.003, height + 0.003);
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <group position={[-0.23, 0, 0.08]} rotation={[0, Math.PI / 4, 0]}>
      {/* 1. Deep Slate-Blue Tower Metallic Cabinet */}
      <mesh geometry={chassisGeometry} castShadow receiveShadow position={[0, 0, -depth]}>
        <meshStandardMaterial color="#33384f" roughness={0.3} metalness={0.65} />
      </mesh>

      {/* 2. Dark Slate-Grey Front Bezel Frame */}
      <mesh geometry={bezelGeometry} castShadow position={[0, 0, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* 3. Dark Recessed Inner Control Panel Plate */}
      <mesh position={[0, height / 2, 0.0125]}>
        <planeGeometry args={[width - 0.006, height - 0.006]} />
        <meshStandardMaterial color="#1e2235" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* 4. Digital Screen Panel (Top) */}
      <mesh position={[0, height * 0.74, 0.0135]}>
        <planeGeometry args={[width * 0.82, 0.038]} />
        <meshStandardMaterial color="#090d16" roughness={0.1} />
      </mesh>

      {/* Digital LED Screen Backlight */}
      <mesh position={[0, height * 0.74, 0.0138]}>
        <planeGeometry args={[width * 0.78, 0.034]} />
        <meshStandardMaterial color="#022c22" roughness={0.2} emissive="#021c14" />
      </mesh>

      {/* Dual Digital LED Display Readout (Voltage & Current) */}
      <Text
        position={[-0.002, height * 0.77, 0.018]}
        fontSize={0.009}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        {`${voltage.toFixed(1)} V`}
      </Text>
      <Text
        position={[-0.002, height * 0.71, 0.018]}
        fontSize={0.008}
        color="#facc15"
        anchorX="center"
        anchorY="middle"
      >
        {`0.50 A  CC/CV`}
      </Text>

      {/* Yellow Status Indicator Bar (Matches Reference Image) */}
      <mesh position={[width * 0.28, height * 0.67, 0.014]}>
        <planeGeometry args={[0.016, 0.004]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* 5. Three Colored Turned Adjustment Knobs (Middle Row) */}
      {/* Blue Voltage Knob */}
      <PowerSupplyColoredKnob position={[-0.026, height * 0.44, 0.013]} color="#3b82f6" />
      {/* Green Fine-Tune Knob */}
      <PowerSupplyColoredKnob position={[0, height * 0.44, 0.013]} color="#22c55e" />
      {/* Red Current-Limit Knob */}
      <PowerSupplyColoredKnob position={[0.026, height * 0.44, 0.013]} color="#ef4444" />

      {/* 6. Lower Push-Button Switches */}
      <mesh position={[-0.024, height * 0.22, 0.014]}>
        <boxGeometry args={[0.01, 0.01, 0.005]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>
      <mesh position={[0.024, height * 0.22, 0.014]}>
        <boxGeometry args={[0.01, 0.01, 0.005]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>

      {/* 7. Output Terminal Binding Posts (+ Red / - Black) */}
      <LatheBindingPost position={[-0.024, height * 0.09, 0.013]} color="#ef4444" label="+" />
      <LatheBindingPost position={[0.024, height * 0.09, 0.013]} color="#1e293b" label="-" />
    </group>
  );
}

/**
 * Programmatically Turned Colored Knob for DC Power Supply (Matching Reference)
 */
function PowerSupplyColoredKnob({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const knobGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const r = 0.009;
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(r, 0));
    points.push(new THREE.Vector2(r, 0.007));
    points.push(new THREE.Vector2(r * 0.8, 0.009));
    points.push(new THREE.Vector2(0, 0.009));
    return new THREE.LatheGeometry(points, 24);
  }, []);

  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={knobGeometry} castShadow>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Indicator Notch */}
      <mesh position={[0, 0.005, 0.008]}>
        <boxGeometry args={[0.0018, 0.005, 0.001]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

/**
 * Digital Multimeter Instrument (Matches user's reference image)
 * High-contrast yellow protective holster, pale green retro LCD screen,
 * hold/select buttons, turned rotary knob with color range tick ring, and 3 terminal ports.
 */
function ExtrudedMultimeterUnit({ readout, mode }: { readout: string; mode: string }) {
  const width = 0.096;
  const height = 0.144;
  const depth = 0.032;

  // Outer Yellow Protective Holster Chassis
  const holsterGeometry = useMemo(() => {
    const r = 0.012;
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 + r, 0);
    shape.lineTo(width / 2 - r, 0);
    shape.quadraticCurveTo(width / 2, 0, width / 2, r);
    shape.lineTo(width / 2, height - r);
    shape.quadraticCurveTo(width / 2, height, width / 2 - r, height);
    shape.lineTo(-width / 2 + r, height);
    shape.quadraticCurveTo(-width / 2, height, -width / 2, height - r);
    shape.lineTo(-width / 2, r);
    shape.quadraticCurveTo(-width / 2, 0, -width / 2 + r, 0);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <group position={[0.23, 0.01, 0.08]} rotation={[-Math.PI / 9, -Math.PI / 4, 0]}>
      {/* 1. Yellow Outer Rubber Holster */}
      <mesh geometry={holsterGeometry} castShadow receiveShadow position={[0, 0, -depth]}>
        <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* 2. Inner Dark Charcoal Faceplate */}
      <mesh position={[0, height / 2, 0.002]}>
        <planeGeometry args={[width - 0.012, height - 0.012]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* 3. LCD Screen Display Frame & Glass (Top) */}
      <mesh position={[0, height * 0.81, 0.003]}>
        <planeGeometry args={[0.076, 0.038]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} />
      </mesh>

      {/* Retro Olive-Green LCD Screen Backlight (Matching Reference Image) */}
      <mesh position={[0, height * 0.81, 0.0035]}>
        <planeGeometry args={[0.072, 0.034]} />
        <meshStandardMaterial color="#dcfce7" roughness={0.2} emissive="#bbf7d0" />
      </mesh>

      {/* Dark Digital Readout Font */}
      <Text
        position={[0, height * 0.825, 0.008]}
        fontSize={0.015}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {readout}
      </Text>

      {/* Mode Indicator Text */}
      <Text
        position={[0, height * 0.74, 0.008]}
        fontSize={0.006}
        color="#334155"
        anchorX="center"
        anchorY="middle"
      >
        {mode.toUpperCase()}
      </Text>

      {/* 4. Upper Push Buttons (Hold & Select) */}
      {/* Light Grey Hold Button (Left) */}
      <mesh position={[-0.02, height * 0.65, 0.0035]}>
        <boxGeometry args={[0.016, 0.006, 0.003]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} />
      </mesh>
      {/* Round Yellow Select Button (Right) */}
      <mesh position={[0.024, height * 0.65, 0.0035]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.003, 16]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>

      {/* 5. Center Rotary Selection Dial & Range Ticks */}
      <MultimeterRotaryDial position={[0, height * 0.44, 0.0035]} />

      {/* 6. Lower Terminal Jacks (10A, COM, V/Ω/C) */}
      {/* 10A Jack (Left - Red Ring) */}
      <mesh position={[-0.026, height * 0.14, 0.0035]}>
        <ringGeometry args={[0.006, 0.009, 20]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* COM Jack (Center - Black) */}
      <LatheBindingPost position={[0, height * 0.12, 0.003]} color="#1e293b" label="COM" />

      {/* V/Ω/C Jack (Right - Red) */}
      <LatheBindingPost position={[0.026, height * 0.12, 0.003]} color="#ef4444" label="V/Ω" />
    </group>
  );
}

/**
 * Programmatically Lathed Multimeter Rotary Selection Knob & Color Ticks (Matching Reference Image)
 */
function MultimeterRotaryDial({ position }: { position: [number, number, number] }) {
  const dialGeom = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const r = 0.022;
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(r, 0));
    points.push(new THREE.Vector2(r, 0.006));
    points.push(new THREE.Vector2(r * 0.85, 0.01));
    points.push(new THREE.Vector2(0, 0.01));
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // Outer 12 White Vector Range Marks
  const tickMarks = useMemo(() => {
    const items: React.ReactNode[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rx = Math.cos(angle) * 0.026;
      const ry = Math.sin(angle) * 0.026;
      const isRed = i >= 1 && i <= 3;
      const isGreen = i >= 6 && i <= 9;
      const color = isRed ? '#ef4444' : isGreen ? '#22c55e' : '#ffffff';
      items.push(
        <mesh key={i} position={[rx, ry, 0.001]}>
          <circleGeometry args={[0.0014, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      );
    }
    return items;
  }, []);

  return (
    <group position={position}>
      {/* Outer Colored Tick Mark Ring */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.024, 0.028, 32]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {tickMarks}

      {/* Main Turned Black Rotary Dial Knob */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={dialGeom} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Center Diagonal Pointer Bar & Arrow (Matches Reference Image) */}
      <mesh position={[0, 0, 0.0105]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.028, 0.006, 0.002]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>
      <mesh position={[-0.008, 0.008, 0.0118]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.006, 0.002, 0.001]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ============================================================================
// PROGRAMMATIC LATHE GEOMETRIES (CAPACITORS, PROBES, KNOBS)
// ============================================================================

/**
 * Programmatically Lathed Electrolytic Capacitor Canister Component
 */
function CapacitorComponent({
  id,
  label,
  value,
  voltage,
  charge,
  color,
  accentColor,
  isSeries,
}: {
  id: 'C1' | 'C2';
  label: string;
  value: number;
  voltage: number;
  charge: number;
  color: string;
  accentColor: string;
  isSeries: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Target positions on breadboard
  const targetPos = useMemo<[number, number, number]>(() => {
    if (isSeries) {
      return id === 'C1' ? [-0.07, 0.018, 0.04] : [0.07, 0.018, 0.04];
    } else {
      return id === 'C1' ? [-0.04, 0.018, 0.01] : [0.04, 0.018, 0.01];
    }
  }, [id, isSeries]);

  // Smooth position damping when switching topologies
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetPos[0],
        5.0,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetPos[1],
        5.0,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetPos[2],
        5.0,
        delta
      );
    }
  });

  const canHeight = 0.055 + value * 0.003;

  return (
    <group ref={groupRef} position={targetPos}>
      {/* Turned Canister Body */}
      <LatheCapacitorBody height={canHeight} mainColor={color} accentColor={accentColor} />

      {/* Clean Vector HUD Text Badge */}
      <group position={[0, canHeight + 0.022, 0]}>
        {/* Background Pill Plate for High Contrast */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.09, 0.022]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.88} />
        </mesh>
        <Text position={[0, 0.002, 0.004]} fontSize={0.009} color="#0f172a" anchorX="center" anchorY="bottom">
          {`${label} (${value} µF)`}
        </Text>
        <Text position={[0, -0.002, 0.004]} fontSize={0.0075} color="#2563eb" anchorX="center" anchorY="top">
          {`V = ${voltage.toFixed(2)}V  |  Q = ${charge.toFixed(1)}µC`}
        </Text>
      </group>
    </group>
  );
}

/**
 * Lathed Capacitor Body Mesh
 */
function LatheCapacitorBody({
  height,
  mainColor,
  accentColor,
}: {
  height: number;
  mainColor: string;
  accentColor: string;
}) {
  const latheGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const r = 0.016;

    // Bottom pin collar
    points.push(new THREE.Vector2(0.0015, 0));
    points.push(new THREE.Vector2(r * 0.85, 0));
    points.push(new THREE.Vector2(r * 0.85, 0.003));
    points.push(new THREE.Vector2(r, 0.005));

    // Lower seal indent
    points.push(new THREE.Vector2(r, height * 0.15));
    points.push(new THREE.Vector2(r * 0.93, height * 0.18));
    points.push(new THREE.Vector2(r, height * 0.21));

    // Cylinder body
    points.push(new THREE.Vector2(r, height * 0.90));

    // Top shoulder & vent ring
    points.push(new THREE.Vector2(r * 0.9, height * 0.96));
    points.push(new THREE.Vector2(r * 0.5, height * 0.98));
    points.push(new THREE.Vector2(0, height * 0.99));

    return new THREE.LatheGeometry(points, 32);
  }, [height]);

  return (
    <group>
      <mesh geometry={latheGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={mainColor} roughness={0.35} metalness={0.45} />
      </mesh>

      {/* Polarity Marker Stripe */}
      <mesh position={[0, height * 0.5, 0.0158]} castShadow>
        <boxGeometry args={[0.006, height * 0.82, 0.0008]} />
        <meshStandardMaterial color={accentColor} roughness={0.2} />
      </mesh>

      {/* Dual Pins */}
      <mesh position={[-0.006, -0.006, 0]}>
        <cylinderGeometry args={[0.0009, 0.0009, 0.012, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.006, -0.006, 0]}>
        <cylinderGeometry args={[0.0009, 0.0009, 0.012, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * Lathed Binding Post / Jack Terminal
 */
function LatheBindingPost({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const geom = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const r = 0.008;
    points.push(new THREE.Vector2(0.003, 0));
    points.push(new THREE.Vector2(0.003, 0.01));
    points.push(new THREE.Vector2(r, 0.01));
    points.push(new THREE.Vector2(r, 0.004));
    points.push(new THREE.Vector2(r * 0.7, 0.002));
    points.push(new THREE.Vector2(0, 0));
    return new THREE.LatheGeometry(points, 20);
  }, []);

  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={geom}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      <Text
        position={[0, 0.014, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.009}
        color="#f8fafc"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * Lathed Rotary Selector Knob
 */
function LatheRotaryKnob({ position }: { position: [number, number, number] }) {
  const geom = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.014, 0));
    points.push(new THREE.Vector2(0.014, 0.006));
    points.push(new THREE.Vector2(0.011, 0.009));
    points.push(new THREE.Vector2(0, 0.009));
    return new THREE.LatheGeometry(points, 24);
  }, []);

  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.005, 0.007]}>
        <boxGeometry args={[0.002, 0.006, 0.001]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

/**
 * Programmatically Lathed Ergonomic Test Probe with Metal Needle Tip
 * Origin (0,0,0) is anchored at the exact tip of the needle inserted in breadboard socket.
 */
function LatheTestProbe({
  position,
  rotation = [0.12, 0, 0],
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}) {
  const needleGeom = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0)); // Needle tip inserted in breadboard socket hole!
    points.push(new THREE.Vector2(0.0004, 0.002));
    points.push(new THREE.Vector2(0.001, 0.012));
    points.push(new THREE.Vector2(0, 0.013));
    return new THREE.LatheGeometry(points, 16);
  }, []);

  const handleGeom = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const r = 0.005;
    points.push(new THREE.Vector2(0.0012, 0.013));
    points.push(new THREE.Vector2(r * 0.4, 0.018));
    points.push(new THREE.Vector2(r * 1.1, 0.024)); // Finger guard collar
    points.push(new THREE.Vector2(r * 0.9, 0.028));
    points.push(new THREE.Vector2(r, 0.065)); // Insulated rubber handle
    points.push(new THREE.Vector2(r * 0.6, 0.072));
    points.push(new THREE.Vector2(0.001, 0.074)); // Cable strain relief collar
    return new THREE.LatheGeometry(points, 24);
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Metallic Probe Tip Needle (Inserted in Socket) */}
      <mesh geometry={needleGeom} castShadow>
        <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.95} />
      </mesh>
      {/* Insulated Plastic/Rubber Probe Body */}
      <mesh geometry={handleGeom} castShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ============================================================================
// CLEAN REALISTIC WIRING HARNESS (EXACT BREADBOARD SOCKET ALIGNMENT)
// ============================================================================

/**
 * Clean Spline Wiring Harness & Multimeter Test Leads
 * Plugs power supply cables, circuit jumpers, and DMM probes directly into breadboard sockets.
 */
function NeatWireHarness({ isSeries }: { isSeries: boolean }) {
  // Breadboard surface socket height
  const socketY = 0.0165;

  // Probe needle tip positions inserted directly into active breadboard socket holes
  const probeRedPos = useMemo<[number, number, number]>(
    () => (isSeries ? [-0.0516, socketY, -0.04] : [-0.0456, socketY, -0.06]),
    [isSeries]
  );
  const probeBlackPos = useMemo<[number, number, number]>(
    () => (isSeries ? [0.0396, socketY, -0.04] : [-0.0456, socketY, 0.06]),
    [isSeries]
  );

  return (
    <group>
      {/* Power Supply (+) Red Cable Plugging Directly into Left Red Power Rail Socket */}
      <SplineCable
        points={[
          [-0.245, 0.014, 0.095],
          [-0.17, 0.035, 0.07],
          [-0.0968, socketY, 0.04],
        ]}
        color="#ef4444"
      />

      {/* Power Supply (-) Black Cable Plugging Directly into Left Blue Ground Rail Socket */}
      <SplineCable
        points={[
          [-0.214, 0.014, 0.062],
          [-0.14, 0.035, 0.05],
          [-0.0770, socketY, 0.04],
        ]}
        color="#1e293b"
      />

      {/* Topology Jumpers Connecting Sockets */}
      {isSeries ? (
        <React.Fragment>
          {/* Jumper 1 (Red): Left Power Rail -> C1 Pin 1 Socket */}
          <SplineCable
            points={[
              [-0.0968, socketY, -0.04],
              [-0.074, 0.026, -0.04],
              [-0.0516, socketY, -0.04],
            ]}
            color="#ef4444"
          />
          {/* Jumper 2 (Yellow): C1 Pin 2 Socket -> C2 Pin 1 Socket */}
          <SplineCable
            points={[
              [-0.0396, socketY, -0.04],
              [-0.006, 0.032, -0.04],
              [0.0276, socketY, -0.04],
            ]}
            color="#eab308"
          />
          {/* Jumper 3 (Black): C2 Pin 2 Socket -> Right Ground Rail Socket */}
          <SplineCable
            points={[
              [0.0396, socketY, -0.04],
              [0.068, 0.026, -0.04],
              [0.0968, socketY, -0.04],
            ]}
            color="#1e293b"
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* Parallel Jumpers across rails */}
          <SplineCable
            points={[
              [-0.0968, socketY, -0.06],
              [-0.074, 0.026, -0.06],
              [-0.0456, socketY, -0.06],
            ]}
            color="#ef4444"
          />
          <SplineCable
            points={[
              [-0.0456, socketY, -0.06],
              [-0.0456, 0.028, 0],
              [-0.0456, socketY, 0.06],
            ]}
            color="#eab308"
          />
          <SplineCable
            points={[
              [-0.0456, socketY, 0.06],
              [0.025, 0.026, 0.06],
              [0.0968, socketY, 0.06],
            ]}
            color="#1e293b"
          />
        </React.Fragment>
      )}

      {/* Multimeter Probes Inserted Vertically into Breadboard Socket Holes */}
      <LatheTestProbe
        position={probeRedPos}
        rotation={[0.15, 0, -0.05]}
        color="#ef4444"
      />
      <LatheTestProbe
        position={probeBlackPos}
        rotation={[0.15, 0, 0.05]}
        color="#1e293b"
      />

      {/* Flexible DMM Coiled Cables from Multimeter Ports to Probe Handles */}
      <SplineCable
        points={[
          [0.245, 0.027, 0.092],
          [0.15, 0.045, 0.05],
          [probeRedPos[0], probeRedPos[1] + 0.072, probeRedPos[2]],
        ]}
        color="#ef4444"
        radius={0.0018}
      />
      <SplineCable
        points={[
          [0.214, 0.027, 0.075],
          [0.13, 0.045, 0.03],
          [probeBlackPos[0], probeBlackPos[1] + 0.072, probeBlackPos[2]],
        ]}
        color="#1e293b"
        radius={0.0018}
      />
    </group>
  );
}

/**
 * Spline Cable Component rendering smooth tube along control points
 */
function SplineCable({
  points,
  color,
  radius = 0.002,
}: {
  points: [number, number, number][];
  color: string;
  radius?: number;
}) {
  const tubeGeometry = useMemo(() => {
    const vecPoints = points.map((p) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(vecPoints);
    return new THREE.TubeGeometry(curve, 24, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

/**
 * Live Charge Flow Particles Moving along Circuit Loops
 */
function AnimatedChargeParticles({ isSeries }: { isSeries: boolean }) {
  const splineCurve = useMemo(() => {
    const pts = isSeries
      ? [
          new THREE.Vector3(-0.245, 0.014, 0.095),
          new THREE.Vector3(-0.0968, 0.0165, 0.04),
          new THREE.Vector3(-0.0516, 0.0165, -0.04),
          new THREE.Vector3(0.0276, 0.0165, -0.04),
          new THREE.Vector3(0.0968, 0.0165, -0.04),
        ]
      : [
          new THREE.Vector3(-0.245, 0.014, 0.095),
          new THREE.Vector3(-0.0968, 0.0165, 0.04),
          new THREE.Vector3(-0.0456, 0.0165, -0.06),
          new THREE.Vector3(-0.0456, 0.0165, 0.06),
        ];
    return new THREE.CatmullRomCurve3(pts, true);
  }, [isSeries]);

  const particlesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.35;
    particlesRef.current.forEach((mesh, index) => {
      if (mesh) {
        const offset = (index / 10 + time) % 1;
        const pos = splineCurve.getPoint(offset);
        mesh.position.copy(pos);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.0025, 10, 10]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      ))}
    </group>
  );
}
