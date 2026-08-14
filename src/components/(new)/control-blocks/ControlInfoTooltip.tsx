"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { InfoIcon } from "lucide-react";

interface ControlInfoTooltipProps {
  description?: string | null;
}

export default function ControlInfoTooltip({ description }: ControlInfoTooltipProps) {
  if (!description) return null;

  return (
    <Tooltip.Provider delay={100}>
      <Tooltip.Root>
        <Tooltip.Trigger
          type="button"
          aria-label="Control info"
          className="p-0.5 rounded-full text-tertiary hover:text-primary-cta hover:bg-primary-cta/10 focus:outline-none transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
        >
          <InfoIcon className="size-3.5" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={6} className="z-50">
            <Tooltip.Popup className="bg-dark-card text-primary-text-light text-caption px-3.5 py-2 rounded-[10px] shadow-xl max-w-60 text-center leading-normal border border-primary-cta/40 outline-none z-50">
              {description}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
