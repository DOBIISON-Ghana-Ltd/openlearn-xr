'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export default function ExploreFLow() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  return (
    <div className="flex-1 bg-surface-white relative w-full h-full min-h-0 flex flex-col overflow-hidden">
      {/* Center Canvas: 3D Atom Graphic */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <img
          src="/(new)/explore-atom.png"
          alt="3D Atom Interactive Simulation"
          className="max-w-[577px] w-full max-h-[561px] object-contain pointer-events-none drop-shadow-md transition-transform duration-300"
        />
      </div>

      {/* GREEN BOX AREA: Fixed Right Controls Panel (Top Action Buttons + Lab Controls Box) */}
      <div className="fixed right-6 lg:right-20 top-[100px] z-30 flex flex-col items-end gap-4">
        {/* Top Action Controls: Restart & Expand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            title="Restart simulation"
            className="bg-primary-subtle border border-disable rounded-[10.3px] size-[36px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <img src="/(new)/icon-restart.svg" alt="Restart" className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Expand view"
            className="bg-primary-subtle border border-disable rounded-[10.3px] size-[36px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <img src="/(new)/icon-expand.svg" alt="Expand" className="size-5" />
          </button>
        </div>

        {/* Lab Controls Floating Card */}
        <div className="bg-primary-light/50 border border-primary-cta/50 backdrop-blur-[4px] rounded-[20px] w-[235px] px-4 py-5 flex flex-col items-center gap-3 shadow-lg">
          {/* Card Title */}
          <h2 className="text-h6 text-primary-text-dark text-center">Lab controls</h2>

          {/* Divider */}
          <div className="w-full h-px bg-primary-cta/30 my-0.5" />

          {/* Controls List */}
          <div className="flex flex-col gap-4 w-full items-center">
            {/* 1. Protons Row */}
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center justify-center gap-2">
                <img src="/(new)/dot-proton.svg" alt="Proton" className="size-[14px]" />
                <span className="text-normal text-primary-text-dark">Protons</span>
              </div>
              <span className="text-caption text-tertiary">Found in the nucleus</span>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-4 mt-1.5">
                <button
                  type="button"
                  onClick={() => setProtons((prev) => Math.max(0, prev - 1))}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-minus.svg" alt="Minus" className="size-4" />
                </button>
                <span className="text-h6 text-primary-text-dark min-w-[20px] text-center">
                  {protons}
                </span>
                <button
                  type="button"
                  onClick={() => setProtons((prev) => prev + 1)}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-plus.svg" alt="Plus" className="size-4" />
                </button>
              </div>
            </div>

            {/* 2. Neutrons Row */}
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center justify-center gap-2">
                <img src="/(new)/dot-neutron.svg" alt="Neutron" className="size-[14px]" />
                <span className="text-normal text-primary-text-dark">Neutrons</span>
              </div>
              <span className="text-caption text-tertiary">Found in the nucleus</span>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-4 mt-1.5">
                <button
                  type="button"
                  onClick={() => setNeutrons((prev) => Math.max(0, prev - 1))}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-minus.svg" alt="Minus" className="size-4" />
                </button>
                <span className="text-h6 text-primary-text-dark min-w-[20px] text-center">
                  {neutrons}
                </span>
                <button
                  type="button"
                  onClick={() => setNeutrons((prev) => prev + 1)}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-plus.svg" alt="Plus" className="size-4" />
                </button>
              </div>
            </div>

            {/* 3. Electrons Row */}
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center justify-center gap-2">
                <img src="/(new)/dot-electron.svg" alt="Electron" className="size-[14px]" />
                <span className="text-normal text-primary-text-dark">Electrons</span>
              </div>
              <span className="text-caption text-tertiary">Orbit around nucleus</span>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-4 mt-1.5">
                <button
                  type="button"
                  onClick={() => setElectrons((prev) => Math.max(0, prev - 1))}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-minus.svg" alt="Minus" className="size-4" />
                </button>
                <span className="text-h6 text-primary-text-dark min-w-[20px] text-center">
                  {electrons}
                </span>
                <button
                  type="button"
                  onClick={() => setElectrons((prev) => prev + 1)}
                  className="bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-[35px] flex items-center justify-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer"
                >
                  <img src="/(new)/icon-plus.svg" alt="Plus" className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}