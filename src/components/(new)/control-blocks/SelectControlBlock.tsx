"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils/cn";
import { SelectControl } from "@/local/simulations/type";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import ControlInfoTooltip from "./ControlTooltip";

interface ISelectControlBlock {
  control: SelectControl;
  value: string;
  onChange: (value: string) => void;
}
export default function SelectControlBlock(props: ISelectControlBlock) {
  const { control, value, onChange } = props;

  return (
    <div className="flex flex-col gap-2 w-full py-2 px-4 pr-3">
      <div className="flex items-center gap-1.5 text-left">
        <ControlInfoTooltip description={control.description} />
        <span className="text-normal text-primary-text-dark font-medium">
          {control.label}
        </span>
      </div>

      <SelectPrimitive.Root
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
      >
        <SelectPrimitive.Trigger
          className="bg-primary-subtle border border-primary-cta/20 h-9 px-3 rounded-md w-full flex items-center justify-between cursor-pointer outline-none hover:bg-primary-light/40 transition-colors"
        >
          <SelectPrimitive.Value
            placeholder="Select option"
            className="text-small text-secondary-text truncate"
          />
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="size-4 text-primary-cta" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner alignItemWithTrigger={false} sideOffset={4} className="z-50 select-none">
            <SelectPrimitive.Popup className="bg-surface-white border border-primary-cta/20 rounded-md overflow-hidden w-(--anchor-width) min-w-(--anchor-width) outline-none">
              {control.options.map((option, index) => (
                <SelectPrimitive.Item
                  key={option}
                  value={option}
                  className={cn(
                    "px-3 py-2 text-small! text-secondary-text cursor-pointer transition-colors outline-none data-highlighted:bg-primary-subtle/30 flex-center justify-between",
                    { "border-b border-primary-light": !(index === (control.options.length - 1)) }
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4 text-primary-cta" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
