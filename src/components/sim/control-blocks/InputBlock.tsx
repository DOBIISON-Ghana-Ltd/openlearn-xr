'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimStore } from '@/store/play/store';

interface InputBlockProps {
  id: string;
  label: string;
  placeholder?: string;
  unit?: string;
}

export function InputBlock({ id, label, placeholder, unit }: InputBlockProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const value = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues[id] ?? ''
  );
  const setControl = useSimStore((s) => s.setControl);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        {unit && <span className="text-[10px] text-muted-foreground/60">{unit}</span>}
      </div>
      <Input
        value={value}
        onChange={(e) => setControl(id, e.target.value)}
        placeholder={placeholder}
        disabled={!activeSessionId}
        className="h-8 text-xs"
      />
    </div>
  );
}
