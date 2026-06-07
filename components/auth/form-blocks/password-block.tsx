"use client";

import * as React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  autoComplete?: string;
};

export default function PasswordBlock<T extends FieldValues>(props: Props<T>) {
  const [visible, setVisible] = React.useState(false);
  const { field, fieldState } = useController({
    name: props.name,
    control: props.control,
  });

  return (
    <Field data-invalid={!!fieldState.error || undefined} className="gap-1.5">
      <InputGroup>
        <InputGroupInput
          id={props.name}
          ref={field.ref}
          type={visible ? "text" : "password"}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={!!fieldState.error}
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={field.value}
          className="text-sm"
        />
        <InputGroupAddon align="inline-end">
          <Button
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  );
}
