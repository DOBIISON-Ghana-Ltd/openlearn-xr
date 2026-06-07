"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  type?: React.ComponentProps<"input">["type"];
  placeholder?: string;
  autoComplete?: string;
};

export default function TextBlock<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({
    name: props.name,
    control: props.control,
  });

  return (
    <Field data-invalid={!!fieldState.error || undefined} className="gap-1.5">
      <Input
        id={props.name}
        ref={field.ref}
        type={props.type}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        aria-invalid={!!fieldState.error}
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value}
        className="text-sm"
      />
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  );
}
