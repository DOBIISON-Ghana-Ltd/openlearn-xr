'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { useStableUserId } from '@/hooks/use-stable-user-id';
import { MOCK_SIMS } from '@/lib/constants/sims';
import { useSimStore } from '@/store/play/store';
import { SimulationRenderer } from '@/components/sim/SimulationRenderer';
import { DynamicControls } from '@/components/sim/control-blocks/DynamicControls';
import { CheckpointTracker } from '@/components/sim/CheckpointTracker';
import { SIM_LOADERS } from '@/components/sim/SimRegistry';
import useApi from '@/data/hooks/use-api';

export default function PlayPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data } = useApi.query('public:user:get:me');
  const userId = useStableUserId(data?.id ?? undefined);

  const initSession = useSimStore((s) => s.initSession);

  const sim = MOCK_SIMS.find((s) => s.id === id);

  const [SimComponent, setSimComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);

  // Load the component
  useEffect(() => {
    if (!sim) {
      setIsLoadingComponent(false);
      return;
    }
    const loader = SIM_LOADERS[sim.componentKey];
    if (loader) {
      setIsLoadingComponent(true);
      loader()
        .then((mod) => {
          setSimComponent(() => mod.default);
        })
        .catch((err) => {
          console.error("Failed to load simulation component:", err);
          setSimComponent(null);
        })
        .finally(() => {
          setIsLoadingComponent(false);
        });
    } else {
      setSimComponent(null);
      setIsLoadingComponent(false);
    }
  }, [sim]);

  // Build initial control values map from sim definition
  const defaultControls = sim
    ? Object.fromEntries(sim.controls.map((c) => [c.id, c.defaultValue]))
    : {};

  const checkpointIds = sim ? sim.checkpoints.map((cp) => cp.id) : [];

  // Init (or restore) the session once we have userId and sim
  useEffect(() => {
    if (!userId || !sim) return;
    initSession(userId, sim.id, defaultControls, checkpointIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, sim?.id]);

  // ── Full Page Loading ─────────────────────────────────────────────────────
  if (isLoadingComponent || !userId) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading simulation lab...</p>
      </div>
    );
  }

  // ── Full Page Not Found ───────────────────────────────────────────────────
  if (!sim || !SimComponent) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-background">
        <AlertTriangle className="w-10 h-10 text-yellow-500" />
        <p className="text-base font-medium">Simulation not found</p>
        <p className="text-xs opacity-60">The requested simulation could not be loaded.</p>
        <p className="text-xs opacity-60">ID: <code>{id}</code></p>
      </div>
    );
  }

  return (
    <div className="size-full">
      {/* LABORATORY */}
      <div className="relative size-full flex flex-col">

        {/* SIMULATION CANVAS */}
        <div className="flex-1 bg-muted overflow-hidden">
          <SimulationRenderer camera={sim.camera}>
            <SimComponent />
          </SimulationRenderer>
        </div>

        {/* CHECKPOINTS + CONTROLS CONTAINER */}
        <div className="flex w-full h-56 bg-background border-t shrink-0">

          {/* CHECKPOINTS */}
          <div className="flex-1 border-r overflow-hidden">
            <CheckpointTracker checkpoints={sim.checkpoints} />
          </div>

          {/* CONTROLS */}
          <div className="flex-1 overflow-hidden">
            <DynamicControls controls={sim.controls} />
          </div>
        </div>

      </div>
    </div>
  );
}
