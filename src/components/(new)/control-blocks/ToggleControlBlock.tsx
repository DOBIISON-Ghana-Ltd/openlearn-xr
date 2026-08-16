"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils/cn";
import { ToggleControl } from "@/local/simulations/type";
import ControlInfoTooltip from "./ControlTooltip";

interface IToggleControlBlock {
  control: ToggleControl;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleControlBlock(props: IToggleControlBlock) {
  const { control, value, onChange } = props;

  return (
    <div className="flex items-center justify-between gap-3 w-full py-2 px-4 pr-3">
      <div className="flex items-center gap-1.5 text-left flex-1 min-w-0">
        <ControlInfoTooltip description={control.description} />
        <span className="text-normal text-primary-text-dark font-medium truncate">
          {control.label}
        </span>
      </div>

      <SwitchPrimitive.Root
        checked={value}
        onCheckedChange={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer outline-none shadow-xs border",
          {
            "bg-primary-cta border-primary-cta": value,
            "bg-primary-subtle border-primary-cta/20": !value,
          }
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block size-4 rounded-full transition-transform duration-200 shadow-xs",
            {
              "bg-surface-white translate-x-6": value,
              "bg-primary-cta translate-x-1": !value,
            }
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
