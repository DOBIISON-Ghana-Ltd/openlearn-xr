'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { useSimStore } from '@/store/play/store';

interface ToggleBlockProps {
  id: string;
  label: string;
  options: { label: string; value: string | number }[];
  unit?: string;
}

export function ToggleBlock({ id, label, options, unit }: ToggleBlockProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const rawValue = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues[id]
  );
  const setControl = useSimStore((s) => s.setControl);

  // Min 2, Max 5 options supported
  const validOptions = options.slice(0, 5);
  const currentValue = rawValue ?? validOptions[0]?.value;

  // ToggleGroup (Base UI) expects value as string[]
  const groupValue: string[] = currentValue != null ? [String(currentValue)] : [];

  return (
    <div className="flex items-center px-4 py-5">
      <div className="flex-1/3 flex items-center gap-1">
        <Label className="text-xs-m font-medium text-foreground">{label}</Label>
        <span className="text-xs-m text-muted-foreground">
          {"( "}{currentValue != null ? currentValue : ''}
          {unit ? ` ${unit}` : ''}{" )"}
        </span>
      </div>
      <div className="flex-2/3 flex items-start gap-1">
        <div className="bg-muted p-3 rounded-md flex-1">
          <ToggleGroup
            value={groupValue}
            onValueChange={(vals) => {
              // Ignore deselect (empty array) — always keep one selected
              if (!vals.length) return;
              const selected = vals[vals.length - 1];
              const match = validOptions.find((o) => String(o.value) === selected);
              setControl(id, match ? match.value : selected);
            }}
            disabled={!activeSessionId}
            size="sm"
            className="w-full flex-wrap gap-1"
          >
            {validOptions.map((opt) => (
              <ToggleGroupItem
                key={String(opt.value)}
                value={String(opt.value)}
                className="text-xs flex-1"
              >
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
