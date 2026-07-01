'use client';

import type { SimControlDef } from '@/lib/constants/sims';
import { SliderBlock } from './SliderBlock';
import { SwitchBlock } from './SwitchBlock';
import { ToggleBlock } from './ToggleBlock';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="h-full flex flex-col">
      <div className="h-9 w-full flex items-center justify-between px-4">
        <div className="flex-center gap-2">
          <h4 className="text-xs-m text-muted-foreground font-medium uppercase">Controls</h4>
        </div>
      </div>
      <ScrollArea className="flex-1">
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
              return <SwitchBlock key={ctrl.id} id={ctrl.id} label={ctrl.label} />;
            case 'toggle':
              return (
                <ToggleBlock
                  key={ctrl.id}
                  id={ctrl.id}
                  label={ctrl.label}
                  options={ctrl.options ?? []}
                  unit={ctrl.unit}
                />
              );
            default:
              return null;
          }
        })}
      </ScrollArea>
    </div>
  );
}
