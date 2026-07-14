"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input, InputPrimitive } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type Props<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: Path<T>;
} & InputPrimitive.Props;

export default function TextBlock<T extends FieldValues>(props: Props<T>) {
  const { label, control, name, ...rest } = props;
  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <Field data-invalid={fieldState.error ? "true" : undefined} className="gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <Input
        id={name}
        ref={field.ref}
        aria-invalid={fieldState.error ? "true" : undefined}
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value}
        className="text-sm"
        {...rest}
      />
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  );
}
