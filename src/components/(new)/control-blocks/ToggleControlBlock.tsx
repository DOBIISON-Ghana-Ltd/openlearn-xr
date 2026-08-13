"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils/cn";
import { ToggleControl } from "@/local/simulations/type";

interface ToggleControlBlockProps {
  control: ToggleControl;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export default function ToggleControlBlock({
  control,
  value,
  onChange,
  className,
}: ToggleControlBlockProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 w-full py-1",
        className
      )}
    >
      <div className="flex flex-col text-left flex-1 min-w-0">
        <span className="text-normal text-primary-text-dark font-medium truncate">
          {control.label}
        </span>
        {control.description && (
          <span className="text-caption text-tertiary truncate">
            {control.description}
          </span>
        )}
      </div>

      <SwitchPrimitive.Root
        checked={value}
        onCheckedChange={onChange}
        className={cn(
          "relative inline-flex h-[24px] w-[48px] shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer outline-none shadow-xs",
          {
            "bg-primary-pressed": value,
            "bg-surface-white border border-primary-cta/40": !value,
          }
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block size-[16px] rounded-full transition-transform duration-200",
            {
              "bg-surface-white translate-x-[26px]": value,
              "bg-primary-pressed translate-x-[4px]": !value,
            }
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
