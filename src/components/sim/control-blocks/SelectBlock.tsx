'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSimStore } from '@/store/play/store';

interface SelectBlockProps {
  id: string;
  label: string;
  options: { label: string; value: string | number }[];
}

export function SelectBlock({ id, label, options }: SelectBlockProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const value = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues[id]
  );
  const setControl = useSimStore((s) => s.setControl);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Select
        value={String(value ?? '')}
        onValueChange={(val) => {
          // Try to coerce back to a number if original value was a number
          const original = options.find((o) => String(o.value) === val);
          setControl(id, original ? original.value : val);
        }}
        disabled={!activeSessionId}
      >
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={String(opt.value)} value={String(opt.value)} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
