"use client";

import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils/cn";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  maxLength?: number;
  containerClassName?: string;
  slotClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function OtpBlock<T extends FieldValues>(props: Props<T>) {
  const {
    control,
    name,
    maxLength = 6,
    containerClassName,
    slotClassName,
    disabled = false,
    readOnly = false,
  } = props;

  const { field } = useController({
    name,
    control,
  });

  return (
    <OTPField.Root
      length={maxLength}
      value={field.value ?? ""}
      onValueChange={(val) => field.onChange(val)}
      disabled={disabled}
      readOnly={readOnly}
      className={cn("w-full flex items-center justify-center gap-2", containerClassName)}
    >
      {Array.from({ length: maxLength }, (_, index) => (
        <OTPField.Input
          key={index}
          aria-label={index === 0 ? undefined : `Character ${index + 1} of ${maxLength}`}
          className={cn(
            "size-11 rounded-lg border border-primary-cta/20 bg-surface-white text-h6 text-primary-text-dark font-semibold text-center flex items-center justify-center transition-all outline-none focus:border-primary-cta focus:ring-2 focus:ring-primary-cta/20 focus:z-10 data-filled:border-primary-cta/40",
            slotClassName
          )}
        />
      ))}
    </OTPField.Root>
  );
}
