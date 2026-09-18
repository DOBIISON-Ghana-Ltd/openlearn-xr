"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils/cn";
import { ToggleControl } from "@/local/simulations/type";
import ControlInfoTooltip from "./control-tooltip";

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
        checked={value ?? control.value}
        onCheckedChange={onChange}
        className={cn(
          "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 border border-primary-cta/20 bg-primary-subtle cursor-pointer outline-none transition-colors duration-150 data-checked:bg-primary-cta"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "size-3.5 bg-surface-white rounded-full block shadow-xs transition-transform duration-150 data-checked:translate-x-4"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
