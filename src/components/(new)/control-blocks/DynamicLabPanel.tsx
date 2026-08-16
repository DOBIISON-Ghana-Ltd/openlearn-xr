"use client";

import { cn } from "@/lib/utils/cn";
import { simStore } from "@/store/sim/store";
import { useStore } from "zustand";
import { ExpandIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@base-ui/react/scroll-area";
import ControlDispatcher from "./ControlDispatcher";

interface IDynamicLabPanel {
  onFullscreenToggle?: () => void;
}
export default function DynamicLabPanel(props: IDynamicLabPanel) {
  const { onFullscreenToggle } = props;
  const controls = useStore(simStore, (state) => state.controls);
  const updateControl = useStore(simStore, (state) => state.updateControl);
  const resetControls = useStore(simStore, (state) => state.resetControls);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreenToggle) {
      onFullscreenToggle();
    }
  };

  const ACTIONS = [
    {
      icon: RotateCcwIcon,
      onClick: resetControls,
      title: "Restart simulation",
    },
    {
      icon: ExpandIcon,
      onClick: handleFullscreen,
      title: "Expand view",
    },
  ];

  if (!controls || controls.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-6 lg:right-20 top-25 z-30 flex flex-col items-end gap-4 max-h-[calc(100vh-140px)]">
      {/* Action Toolbar */}
      <div className="flex items-center gap-3 shrink-0">
        {ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            title={action.title}
            className="bg-primary-subtle border border-disable rounded-[10.3px] size-9 flex-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <action.icon className="size-5 text-primary-text-dark" />
          </button>
        ))}
      </div>

      {/* Lab Controls Floating Card */}
      <div className="bg-primary-light border border-primary-cta/50 rounded-2xl w-84 flex flex-col items-center gap-3 flex-1 min-h-0 overflow-hidden">
        <h2 className="w-full p-4 text-h6 text-primary-text-dark shrink-0 border-b border-primary-cta/30">
          Lab controls
        </h2>

        {/* Base UI ScrollArea */}
        <ScrollArea.Root className="flex-1 w-full min-h-0 overflow-hidden">
          <ScrollArea.Viewport className="size-full rounded-[inherit] outline-none">
            <ScrollArea.Content className="flex flex-col gap-1 w-full items-center pr-1 pb-1">
              {controls.map((control) => (
                <ControlDispatcher
                  key={control.id}
                  control={control}
                  value={control.value}
                  onChange={(val) => updateControl(control.id, val)}
                />
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="m-1 flex w-1.5 opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-primary-cta/40 hover:bg-primary-cta/60" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}


