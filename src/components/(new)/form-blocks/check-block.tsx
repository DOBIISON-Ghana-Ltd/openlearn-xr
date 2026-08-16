"use client";

import * as React from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  className?: string;
};

export default function CheckBlock<T extends FieldValues>(props: Props<T>) {
  const { control, name, label, className } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <label className={cn("flex items-start gap-2 cursor-pointer select-none", className)}>
      <Checkbox.Root
        id={name}
        checked={Boolean(field.value)}
        onCheckedChange={(checked) => field.onChange(checked)}
        onBlur={field.onBlur}
        className="size-4 shrink-0 rounded border border-primary-cta/40 bg-surface-white flex items-center justify-center text-primary-cta data-checked:bg-primary-cta data-checked:text-primary-text-light data-checked:border-primary-cta transition-colors mt-0.5"
      >
        <Checkbox.Indicator className="flex items-center justify-center">
          <CheckIcon className="size-3 stroke-3" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="text-caption text-secondary-text leading-snug">
        {label}
      </span>
    </label>
  );
}
