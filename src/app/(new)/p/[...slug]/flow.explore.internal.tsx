"use client";

import { useEffect } from 'react';
import { InternalSimulationConfig } from '@/local/simulations/type';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import DynamicLabPanel from '@/components/(new)/control-blocks/DynamicLabPanel';
import { Renderer } from '@/local/simulations';

interface FlowExploreInternalProps {
  config: InternalSimulationConfig;
}

export default function FlowExploreInternal({ config }: FlowExploreInternalProps) {
  const initializeControls = useStore(simStore, (s) => s.initializeControls);
  const clearControls = useStore(simStore, (s) => s.clearControls);

  useEffect(() => {
    if (config?.controls) {
      initializeControls(config.controls);
    }
    return () => {
      clearControls();
    };
  }, [config, initializeControls, clearControls]);

  const Model = config.Model;
  const Overlay = config.Overlay;

  return (
    <>
      {/* SIMULATION RENDERER */}
      <Renderer overlay={Overlay ? <Overlay /> : undefined}>
        <Model slug={config.slug} />
      </Renderer>

      {/* DYNAMIC LAB PANEL */}
      <DynamicLabPanel />
    </>
  );
}
