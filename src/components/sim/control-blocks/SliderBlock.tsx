'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useSimStore } from '@/store/play/store';

interface SliderBlockProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export function SliderBlock({ id, label, min, max, step, unit }: SliderBlockProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const value: number = useSimStore(
    (s) => (s.sessions[s.activeSessionId ?? '']?.controlValues[id] as number) ?? min
  );
  const setControl = useSimStore((s) => s.setControl);

  return (
    <div className="flex items-center px-4 py-5">
      <div className="flex-1/3 flex items-center gap-1">
        <Label className="text-xs-m font-medium text-foreground">{label}</Label>
        <span className="text-xs-m text-muted-foreground">
          {"( "}{Number(value).toFixed(1)}
          {unit ? ` ${unit}` : ''}{" )"}
        </span>
      </div>
      <div className="flex-2/3 flex items-start gap-1">
        <div className="bg-muted p-3 rounded-md flex-1 space-y-1">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={(val) => setControl(id, val)}
            disabled={!activeSessionId}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>{min}{unit ? ` ${unit}` : ''}</span>
            <span>{max}{unit ? ` ${unit}` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
