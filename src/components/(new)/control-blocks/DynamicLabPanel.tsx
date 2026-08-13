"use client";

import { cn } from "@/lib/utils/cn";
import { simStore } from "@/store/sim/store";
import { useStore } from "zustand";
import { ExpandIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import ControlBlockDispatcher from "./ControlBlockDispatcher";

interface DynamicLabPanelProps {
  className?: string;
  onFullscreenToggle?: () => void;
}

export default function DynamicLabPanel({
  className,
  onFullscreenToggle,
}: DynamicLabPanelProps) {
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
    <div
      className={cn(
        "fixed right-6 lg:right-20 top-25 z-30 flex flex-col items-end gap-4 max-h-[calc(100vh-140px)]",
        className
      )}
    >
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
      <div className="bg-primary-light/50 border border-primary-cta/50 backdrop-blur-xs rounded-[20px] w-58.75 p-5 flex flex-col items-center gap-3 shadow-lg overflow-y-auto max-h-full">
        <h2 className="text-h6 text-primary-text-dark text-center font-semibold shrink-0">
          Lab controls
        </h2>

        <div className="w-full h-px bg-primary-cta/30 my-0.5 shrink-0" />

        <div className="flex flex-col gap-4 w-full items-center">
          {controls.map((control) => (
            <ControlBlockDispatcher
              key={control.id}
              control={control}
              value={control.value}
              onChange={(val) => updateControl(control.id, val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

