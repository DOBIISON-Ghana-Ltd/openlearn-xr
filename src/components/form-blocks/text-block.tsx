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
  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <Input
        id={name}
        ref={field.ref}
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value ?? ""}
        aria-invalid={hasError}
        data-invalid={hasError ? "" : undefined}
        className={cn(
          "w-full h-10 bg-surface-white border border-primary-cta/20 rounded-lg px-4 py-3 text-small text-primary-text-dark placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-colors",
          "data-invalid:border-error focus:data-invalid:border-error aria-invalid:border-error focus:aria-invalid:border-error",
          className
        )}
        {...rest}
      />
      {fieldState.error?.message && (
        <p className="text-caption text-error">{fieldState.error.message}</p>
      )}
    </div>
  );
}

