"use client";

import { cn } from '@/lib/utils/cn';
import { ExpandIcon, MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { SetStateAction, useState } from 'react';

export default function FlowExploreInternal() {
  return (
    <>
      {/* RENDERER */}
      <div className="flex-1 flex-center p-6 relative overflow-hidden">
        <img
          src="/(new)/explore-atom.png"
          alt="3D Atom Interactive Simulation"
          className="max-w-xl w-full max-h-140.25 object-contain pointer-events-none drop-shadow-md transition-transform duration-300"
        />
      </div>

      {/* LAB PANEL */}
      <LabPanel />
    </>
  )
};

function LabPanel() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const ACTIONS = [
    { icon: RotateCcwIcon, onClick: handleReset, title: "Restart simulation" },
    { icon: ExpandIcon, onClick: handleFullscreen, title: "Expand view" }
  ];

  const CONTROLS = [
    { label: "Protons", description: "Found in the nucleus", value: protons, setValue: setProtons },
    { label: "Neutrons", description: "Found in the nucleus", value: neutrons, setValue: setNeutrons },
    { label: "Electrons", description: "Found in the electrons", value: electrons, setValue: setElectrons },
  ]

  return (
    <div className="fixed right-6 lg:right-20 top-25 z-30 flex flex-col items-end gap-4">
      {/* Top Action Controls: Restart & Expand */}
      <div className="flex items-center gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            title={action.title}
            className="bg-primary-subtle border border-disable rounded-[10.3px] size-9 flex-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <action.icon className="size-5" />
          </button>
        ))}
      </div>

      {/* Lab Controls Floating Card */}
      <div className="bg-primary-light/50 border border-primary-cta/50 backdrop-blur-xs rounded-[20px] w-58.75 p-5 flex flex-col items-center gap-3 shadow-lg">
        {/* Card Title */}
        <h2 className="text-h6 text-primary-text-dark text-center">Lab controls</h2>

        {/* Divider */}
        <div className="w-full h-px bg-primary-cta/30 my-0.5" />

        {/* Controls List */}
        <div className="flex flex-col gap-4 w-full items-center">
          {CONTROLS.map((control) => (
            <div key={control.label} className="flex flex-col items-center gap-1 w-full">
              <span className="text-normal text-primary-text-dark">{control.label}</span>
              <span className="text-caption text-tertiary">{control.description}</span>
              <StepperControl value={control.value} setValue={control.setValue} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

type IStepperControl = {
  value: number,
  setValue: (value: SetStateAction<number>) => void
}
function StepperControl(props: IStepperControl) {
  const { value, setValue } = props;

  const buttons = [
    { icon: MinusIcon, onClick: () => setValue((prev) => Math.max(0, prev - 1)), class: "order-1" },
    { icon: PlusIcon, onClick: () => setValue((prev) => prev + 1), class: "order-3" }
  ]

  return (
    <div className="flex-center gap-4 mt-1.5">
      {buttons.map((b, index) => (
        <button
          key={index}
          type="button"
          onClick={b.onClick}
          className={cn(
            "bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-8.75 flex-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer",
            b.class
          )}
        >
          <b.icon className="size-4" />
        </button>
      ))}
      <span className="text-h6 text-primary-text-dark min-w-5 text-center order-2">
        {value}
      </span>
    </div>
  )
}