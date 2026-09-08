"use client";

import { useEffect, useState } from 'react';
import { InternalSimulationConfig } from '@/local/simulations/type';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import DynamicLabPanel from '@/components/(new)/control-blocks/dynamic-lab-panel';
import { Renderer } from '@/local/simulations';
import { Popover } from '@base-ui/react/popover';
import { ScrollArea } from '@/components/(new)/ui/scroll-area';
import { InfoIcon, XIcon } from 'lucide-react';

interface FlowExploreInternalProps {
  config: InternalSimulationConfig;
}

const SIMULATION_INFO: Record<string, { instructions: string; equations: { name: string; formula: string }[] }> = {
  'simple-harmonic-motion': {
    instructions: 'Use the controls on the right panel to adjust pendulum length, bob mass, initial angle, and gravity environment. Press Release Pendulum to start oscillating and observe real-time kinetic and potential energy conservation.',
    equations: [
      { name: 'Theoretical Period (T₀)', formula: 'T = 2π √(L / g) · (1 + ¹/₁₆ θ₀²)' },
      { name: 'Kinetic Energy (Ek)', formula: 'Ek = ½ m v²' },
      { name: 'Potential Energy (Ep)', formula: 'Ep = m · g · h' },
    ],
  },
  'forces-and-motion-coefficient-of-friction': {
    instructions: 'Set the block mass and choose a surface material condition (Dry Wood, Powdered, Oiled). Activate the spring balance pull to observe static friction tension ramp and dynamic sliding transition.',
    equations: [
      { name: 'Max Static Friction', formula: 'Fs,max = μs · N' },
      { name: 'Kinetic Friction', formula: 'Fk = μk · N' },
      { name: 'Normal Force', formula: 'N = m · g' },
    ],
  },
  'series-and-parallel-connections-of-capacitors': {
    instructions: 'Toggle circuit configuration between Series and Parallel. Adjust supply voltage, capacitor values (C₁, C₂), and move the multimeter probe target to measure individual and equivalent circuit telemetry.',
    equations: [
      { name: 'Series Equivalent', formula: '1/C_eq = 1/C₁ + 1/C₂' },
      { name: 'Parallel Equivalent', formula: 'C_eq = C₁ + C₂' },
      { name: 'Stored Charge & Energy', formula: 'Q = C · V  |  U = ½ C V²' },
    ],
  },
  'determine-enthalpy-changes': {
    instructions: 'Choose reaction type and reactant amount, then initiate the reaction. Observe the temperature changes on the calorimeter thermometer and computed thermodynamic heat transfer in real time.',
    equations: [
      { name: 'Heat Transfer (q)', formula: 'q = m · c · ΔT' },
      { name: 'Specific Heat (Water)', formula: 'c = 4.18 J/(g·°C)' },
      { name: 'Molar Enthalpy (ΔH)', formula: 'ΔH = -q / n' },
    ],
  },
  'chemical-bonding': {
    instructions: 'Select different chemical molecules to observe VSEPR 3D geometries, hybrid orbital shapes, and bond angle overlays.',
    equations: [
      { name: 'Linear (sp)', formula: '180° bond angle (e.g. BeCl₂)' },
      { name: 'Trigonal Planar (sp²)', formula: '120° bond angle (e.g. BCl₃)' },
      { name: 'Tetrahedral (sp³)', formula: '109.5° bond angle (e.g. CH₄)' },
    ],
  },
  'model-daltons-atom-and-orbitals': {
    instructions: 'Explore historical and modern atomic representations from Dalton and Thomson to Bohr and quantum mechanical orbitals (1s, 2s, 2p).',
    equations: [
      { name: 'Quantum Numbers', formula: 'n (Principal), ℓ (Azimuthal), mℓ (Magnetic)' },
      { name: 'Orbital Capacity', formula: 'Capacity = 2(2ℓ + 1) electrons' },
    ],
  },
};

export default function FlowExploreInternal({ config }: FlowExploreInternalProps) {
  const initializeControls = useStore(simStore, (s) => s.initializeControls);
  const clearControls = useStore(simStore, (s) => s.clearControls);

  useEffect(() => {
    if (config?.controls) {
      initializeControls(config.controls);
    }
    return () => {
      clearControls();
    };
  }, [config, initializeControls, clearControls]);

  const Model = config.Model;
  const Overlay = config.Overlay;

  return (
    <>
      {/* SIMULATION RENDERER */}
      <Renderer overlay={Overlay ? <Overlay /> : undefined}>
        <Model slug={config.slug} />
      </Renderer>

      <InfoButton config={config} />

      {/* DYNAMIC LAB PANEL */}
      <DynamicLabPanel />
    </>
  );
}

function InfoButton({ config }: { config: InternalSimulationConfig }) {
  const [open, setOpen] = useState(false);
  const info = SIMULATION_INFO[config.slug] ?? {
    instructions: 'Use the controls on the right panel to set initial conditions and parameters. Observe real-time interaction on the 3D model and live telemetry overlays.',
    equations: [
      { name: "Newton's Second Law", formula: 'F = m · a' },
    ],
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        const dismissReasons: Popover.Root.ChangeEventReason[] = ['outside-press', 'focus-out'];
        // Only allow closing via the X button (close-press) or Escape key
        if (!nextOpen && dismissReasons.includes(eventDetails.reason)) return;
        setOpen(nextOpen);
      }}
    >
      <Popover.Trigger
        type="button"
        title="Simulation information & guide"
        className="absolute top-2 left-2 z-30 bg-primary-subtle border border-primary-light rounded-[10.3px] size-9 flex-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-primary-cta"
      >
        <InfoIcon className="size-5 text-primary-text-dark" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} className="z-50">
          <Popover.Popup className="w-80 bg-surface-white pb-4 rounded-2xl shadow-xl flex flex-col overflow-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="flex-center justify-between shrink-0 px-4 py-2.5">
              <Popover.Title className="text-caption font-bold text-primary-text-dark uppercase tracking-wide">
                Lab Guide & Reference
              </Popover.Title>
              <Popover.Close className="size-6 flex-center rounded-lg text-tertiary hover:text-primary-text-dark hover:bg-primary-light/50 transition-colors cursor-pointer shrink-0">
                <XIcon className="size-4" />
              </Popover.Close>
            </div>

            <ScrollArea className="w-full h-52" overscrollContain>
              <div className="flex flex-col gap-2.5 px-4">
                <Popover.Description className="text-caption text-secondary-text leading-relaxed">
                  {info.instructions}
                </Popover.Description>

                {info.equations.length > 0 && (
                  <>
                    <div className="w-full h-px bg-primary-light/80 my-0.5" />
                    <div className="flex flex-col gap-1.5">
                      <p className="m-0 text-micro text-tertiary font-semibold tracking-[0.08em] uppercase">
                        Key Equations
                      </p>
                      {info.equations.map((eq) => (
                        <div
                          key={eq.name}
                          className="bg-primary-subtle/80 border border-primary-light rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5"
                        >
                          <span className="text-micro text-tertiary font-medium">{eq.name}</span>
                          <span className="text-caption font-mono font-bold text-primary-text-dark">{eq.formula}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}