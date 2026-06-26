'use client';

import type { SimControlDef } from '@/lib/constants/sims';
import { SliderBlock } from './SliderBlock';
import { SwitchBlock } from './SwitchBlock';
import { SelectBlock } from './SelectBlock';
import { InputBlock } from './InputBlock';

interface DynamicControlsProps {
  controls: SimControlDef[];
}

/**
 * Renders the correct control block for each SimControlDef.
 * Add new control types here as they're built.
 */
export function DynamicControls({ controls }: DynamicControlsProps) {
  if (controls.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        No controls for this simulation.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {controls.map((ctrl) => {
        switch (ctrl.type) {
          case 'slider':
            return (
              <SliderBlock
                key={ctrl.id}
                id={ctrl.id}
                label={ctrl.label}
                min={ctrl.min ?? 0}
                max={ctrl.max ?? 100}
                step={ctrl.step ?? 1}
                unit={ctrl.unit}
              />
            );
          case 'switch':
          case 'toggle':
            return <SwitchBlock key={ctrl.id} id={ctrl.id} label={ctrl.label} />;
          case 'select':
            return (
              <SelectBlock
                key={ctrl.id}
                id={ctrl.id}
                label={ctrl.label}
                options={ctrl.options ?? []}
              />
            );
          case 'input':
            return (
              <InputBlock
                key={ctrl.id}
                id={ctrl.id}
                label={ctrl.label}
                unit={ctrl.unit}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
