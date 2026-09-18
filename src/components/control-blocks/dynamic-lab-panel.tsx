"use client";

import { cn } from "@/lib/utils/cn";
import { simStore } from "@/store/sim/store";
import { useStore } from "zustand";
import { ExpandIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@base-ui/react/scroll-area";
import ControlDispatcher from "./control-dispatcher";

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
    <div className="absolute right-2 inset-y-2 z-30 flex flex-col gap-2">
      {/* Action Toolbar */}
      <div className="flex-center justify-end gap-3 shrink-0">
        {ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            title={action.title}
            className="bg-primary-subtle border border-primary-light rounded-[10.3px] size-9 flex-center hover:bg-primary-light/70 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <action.icon className="size-5 text-primary-text-dark" />
          </button>
        ))}
      </div>

      {/* Floating Controls Overlay Card */}
      <div className="bg-surface-white rounded-xl shadow-lg flex flex-col w-64 lg:w-72 overflow-hidden flex-1 max-h-full min-h-0">
        {/* Header Bar */}
        <div className="py-2.5 px-4 bg-surface-slate/30 border-b border-surface-slate flex items-center justify-between shrink-0">
          <span className="text-small font-semibold text-primary-text-dark">
            Controls
          </span>
        </div>

        {/* Scrollable Controls Container */}
        <ScrollArea.Root className="flex-1 w-full min-h-0 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full divide-y divide-surface-slate">
            {controls.map((ctrl) => (
              <div key={ctrl.id} className="w-full">
                <ControlDispatcher
                  control={ctrl}
                  value={ctrl.value}
                  onChange={(val) => updateControl(ctrl.id, val)}
                />
              </div>
            ))}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-black/5 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut w-1.5"
          >
            <ScrollArea.Thumb className="flex-1 bg-surface-slate rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-11 before:min-h-11" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
