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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <span className="text-xs font-mono tabular-nums text-foreground">
          {Number(value).toFixed(1)}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
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
  );
}
