'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// ── Sim Registry ──────────────────────────────────────────────────────────────
// Add new sims here as they're built. Each is lazy-loaded only when needed.
const SIM_MAP: Record<string, React.ComponentType> = {
  PressureDepthSim: dynamic(() => import('./PressureDepthSim'), {
    ssr: false,
    loading: () => <SimLoader />,
  }),
};

// ── Loader ───────────────────────────────────────────────────────────────────
function SimLoader() {
  return (
    <div className="flex flex-col items-center justify-center size-full gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-sm">Loading simulation...</p>
    </div>
  );
}

// ── Not Found ────────────────────────────────────────────────────────────────
function SimNotFound({ componentKey }: { componentKey: string }) {
  return (
    <div className="flex flex-col items-center justify-center size-full gap-2 text-muted-foreground">
      <p className="text-sm font-medium">Simulation not found</p>
      <p className="text-xs opacity-60">key: <code>{componentKey}</code></p>
    </div>
  );
}

// ── Exported Renderer ─────────────────────────────────────────────────────────
interface SimulationRendererProps {
  componentKey: string;
}

export function SimulationRenderer({ componentKey }: SimulationRendererProps) {
  const SimComponent = SIM_MAP[componentKey];

  if (!SimComponent) {
    return <SimNotFound componentKey={componentKey} />;
  }

  return <SimComponent />;
}
