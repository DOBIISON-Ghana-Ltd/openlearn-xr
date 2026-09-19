"use client";

import * as React from "react";
import { Input } from "@base-ui/react/input";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & Input.Props;

export default function PasswordBlock<T extends FieldValues>(props: Props<T>) {
  const [visible, setVisible] = React.useState(false);
  const { control, name, className, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <div className="relative w-full">
      <Input
        id={name}
        ref={field.ref}
        type={visible ? "text" : "password"}
        onBlur={field.onBlur}
        onChange={field.onChange}
        value={field.value ?? ""}
        className={cn(
          "w-full h-10 bg-surface-white border border-primary-cta/20 rounded-lg pl-4 pr-10 py-3 text-small text-primary-text-dark placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-colors",
          className
        )}
        {...rest}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary-text-dark transition-colors cursor-pointer"
      >
        {visible ? (
          <EyeOffIcon className="size-5" />
        ) : (
          <EyeIcon className="size-5" />
        )}
      </button>
    </div>
  );
}
