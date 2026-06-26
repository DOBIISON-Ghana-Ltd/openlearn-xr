'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSimStore } from '@/store/play/store';

interface SwitchBlockProps {
  id: string;
  label: string;
}

export function SwitchBlock({ id, label }: SwitchBlockProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const value = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.controlValues[id] ?? false
  );
  const setControl = useSimStore((s) => s.setControl);

  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(checked) => setControl(id, checked)}
        disabled={!activeSessionId}
      />
    </div>
  );
}
