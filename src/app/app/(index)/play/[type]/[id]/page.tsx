'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { authClient } from '@/adapters/auth/client';
import { MOCK_SIMS } from '@/lib/constants/sims';
import { useSimStore } from '@/store/play/store';
import { SimulationRenderer } from '@/components/sim/SimulationRenderer';
import { DynamicControls } from '@/components/sim/control-blocks/DynamicControls';
import { CheckpointTracker } from '@/components/sim/CheckpointTracker';

export default function PlayPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const initSession = useSimStore((s) => s.initSession);
  const resetSession = useSimStore((s) => s.resetSession);

  const sim = MOCK_SIMS.find((s) => s.id === id);

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

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!sim) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
        <p className="text-sm font-medium">Simulation not found</p>
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
          <SimulationRenderer componentKey={sim.componentKey} />
        </div>

        {/* CHECKPOINTS + CONTROLS CONTAINER */}
        <div className="w-full bg-background border-t shrink-0">

          {/* TOP BAR — actions strip */}
          <div className="w-full h-9 flex items-center px-3 gap-2 border-b">
            <span className="text-xs font-medium text-muted-foreground truncate">
              {sim.title}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Reset simulation"
                onClick={() => resetSession(defaultControls, checkpointIds)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* BOTTOM PANELS */}
          <div className="flex w-full h-52 border-t">

            {/* CHECKPOINTS */}
            <div className="flex-1 border-r overflow-hidden">
              <CheckpointTracker checkpoints={sim.checkpoints} />
            </div>

            {/* CONTROLS */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">
                    Controls
                  </p>
                  <DynamicControls controls={sim.controls} />
                </div>
              </ScrollArea>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
