"use client";

import * as React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
};

export default function CheckBlock<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({
    name: props.name,
    control: props.control,
  });

  return (
    <Field className="gap-1.5">
      <div className="flex items-start gap-2">
        <Checkbox
          id={props.name}
          checked={!!field.value}
          onCheckedChange={(checked) => field.onChange(!!checked)}
          onBlur={field.onBlur}
          ref={field.ref}
        />
        <label htmlFor={props.name} className="text-xs text-foreground leading-tight">
          {props.label}
        </label>
      </div>
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  );
}
