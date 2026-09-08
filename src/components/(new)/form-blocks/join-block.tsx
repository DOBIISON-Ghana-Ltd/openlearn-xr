"use client";

import * as React from "react";
import { Input } from "@base-ui/react/input";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import { joinCode } from "@/lib/utils/generate-join-code";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<Input.Props, "name">;

export default function JoinBlock<T extends FieldValues>(props: Props<T>) {
  const { control, name, className, onChange: externalOnChange, ...rest } = props;
  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  const handleChange: Input.Props["onChange"] = (e) => {
    const formatted = joinCode.format(e.target.value);
    field.onChange(formatted);
    externalOnChange?.(e);
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <Input
        id={name}
        ref={field.ref}
        onBlur={field.onBlur}
        onChange={handleChange}
        value={field.value ?? ""}
        maxLength={14}
        autoComplete="off"
        spellCheck={false}
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
