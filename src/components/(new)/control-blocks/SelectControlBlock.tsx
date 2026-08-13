"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils/cn";
import { SelectControl } from "@/local/simulations/type";
import { ChevronDownIcon } from "lucide-react";

interface SelectControlBlockProps {
  control: SelectControl;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SelectControlBlock({
  control,
  value,
  onChange,
  className,
}: SelectControlBlockProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full py-1", className)}>
      <div className="flex flex-col text-left">
        <span className="text-normal text-primary-text-dark font-medium">
          {control.label}
        </span>
        {control.description && (
          <span className="text-caption text-tertiary">
            {control.description}
          </span>
        )}
      </div>

      <SelectPrimitive.Root
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
      >
        <SelectPrimitive.Trigger
          className="bg-primary-subtle border border-primary-cta/20 h-[33px] px-3 rounded-[10px] w-full flex items-center justify-between cursor-pointer outline-none hover:bg-primary-light/40 transition-colors"
        >
          <SelectPrimitive.Value
            placeholder="Select option"
            className="text-[12px] text-secondary-text truncate font-normal"
          />
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="size-4 text-primary-cta" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner sideOffset={4}>
            <SelectPrimitive.Popup className="bg-primary-subtle border border-primary-cta/20 rounded-[10px] shadow-md overflow-hidden min-w-[168px] z-50">
              {control.options.map((option, index) => {
                const isLast = index === control.options.length - 1;
                return (
                  <SelectPrimitive.Item
                    key={option}
                    value={option}
                    className={cn(
                      "px-3 py-1.5 text-[12px] text-secondary-text cursor-pointer hover:bg-primary-light/50 transition-colors flex items-center outline-none data-highlighted:bg-primary-light/60",
                      {
                        "border-b border-primary-cta/20": !isLast,
                      }
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {option}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                );
              })}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
