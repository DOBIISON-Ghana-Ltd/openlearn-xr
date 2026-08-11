"use client";

import { Input } from "@base-ui/react/input";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils/cn";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & Input.Props;

export default function TextBlock<T extends FieldValues>(props: Props<T>) {
  const { control, name, className, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <Input
      id={name}
      ref={field.ref}
      onBlur={field.onBlur}
      onChange={field.onChange}
      value={field.value ?? ""}
      className={cn(
        "w-full h-10 bg-surface-white border border-primary-cta/20 rounded-lg px-4 py-3 text-small text-primary-text-dark placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-colors",
        className
      )}
      {...rest}
    />
  );
}

