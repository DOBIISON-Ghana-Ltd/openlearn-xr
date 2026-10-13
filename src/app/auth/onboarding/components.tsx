"use client";

import * as React from "react";
import { Input } from "@base-ui/react/input";
import { Select } from "@base-ui/react/select";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@base-ui/react";
import { parser } from "@/lib/utils/phone";

type IWithLabel = {
  htmlFor?: string;
  label: string;
  children: React.ReactNode;
};
export function WithLabel(props: IWithLabel) {
  const { htmlFor, label, children } = props;

  return (
    <div className="w-full space-y-2">
      <label htmlFor={htmlFor} className="block text-sm text-neutral-500 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

type ISubmitButton = {
  loading?: boolean;
  label: string;
} & Omit<Button.Props, "className">;
export function SubmitButton(props: ISubmitButton) {
  const { loading = false, label, ...rest } = props;

  return (
    <Button
      type="submit"
      {...rest}
      className={cn(
        "w-full max-w-xs h-12 bg-neutral-900 hover:bg-neutral-800 text-neutral-50 rounded-full transition-colors font-medium text-sm",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
      )}
    >
      {label}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Text / Input Block
// ---------------------------------------------------------------------------
type IInputBlock<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};
export function InputBlock<T extends FieldValues>(props: IInputBlock<T>) {
  const { control, name, label } = props;
  const { field } = useController({ name, control });

  return (
    <WithLabel htmlFor={name} label={label}>
      <Input
        id={name}
        {...field}
        className={cn(
          "w-full h-12 rounded-full border border-neutral-300 px-6 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors bg-white",
          "data-invalid:border-error focus:data-invalid:border-error aria-invalid:border-error focus:aria-invalid:border-error"
        )}
      />
    </WithLabel>
  );
}

// ---------------------------------------------------------------------------
// Phone Block
// ---------------------------------------------------------------------------
type IPhoneBlock<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};
export function PhoneBlock<T extends FieldValues>(props: IPhoneBlock<T>) {
  const { control, name, label } = props;
  const { field } = useController({ name, control });

  return (
    <WithLabel htmlFor={name} label={label}>
      <div
        className={cn(
          "overflow-hidden w-full h-12 rounded-full border border-neutral-300 bg-white flex items-center focus-within:border-neutral-900 transition-colors",
          "data-invalid:border-error focus-within:data-invalid:border-error"
        )}
      >
        <div className="px-4 h-full flex-center">
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full shrink-0 select-none">
            +233
          </span>
        </div>
        <Input
          id={name}
          type="tel"
          placeholder="240678456"
          maxLength={9}
          value={parser.in(field.value)}
          onChange={(e) => field.onChange(parser.out(e.target.value))}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
          className="flex-1 h-full px-2 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none tracking-wide"
        />
      </div>
    </WithLabel>
  );
}

// ---------------------------------------------------------------------------
// Select Block
// ---------------------------------------------------------------------------
export type SelectOption = {
  label: string;
  value: string;
};
type ISelectBlock<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
  label: string;
  placeholder?: string;
};
export function SelectBlock<T extends FieldValues>(props: ISelectBlock<T>) {
  const { control, name, options, placeholder, label } = props;
  const { field } = useController({ name, control });

  return (
    <WithLabel htmlFor={name} label={label}>
      <Select.Root
        value={field.value ?? ""}
        onValueChange={(val) => {
          if (val !== null) field.onChange(val);
        }}
      >
        <Select.Trigger
          id={name}
          onBlur={field.onBlur}
          className={cn(
            "w-full h-12 rounded-full border border-neutral-300 px-6 flex items-center justify-between text-sm text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors cursor-pointer bg-white",
            "aria-invalid:border-error focus:aria-invalid:border-error"
          )}
        >
          <Select.Value
            placeholder={placeholder}
            className="text-neutral-400 data-placeholder-shown:text-neutral-400 truncate"
          />
          <Select.Icon>
            <ChevronDownIcon className="size-4 text-neutral-500 shrink-0" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false} sideOffset={6} className="z-50 select-none">
            <Select.Popup className="bg-white border border-neutral-200 rounded-2xl p-1.5 shadow-lg overflow-hidden w-(--anchor-width) min-w-(--anchor-width) max-h-60 outline-none">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-4 py-2.5 text-sm text-neutral-700 rounded-xl cursor-pointer transition-colors outline-none data-highlighted:bg-neutral-100 flex items-center justify-between"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon className="size-4 text-neutral-900" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </WithLabel>
  );
}

// ---------------------------------------------------------------------------
// Select License Block
// ---------------------------------------------------------------------------
export type LicenseOption = {
  label: string;
  value: string;
};
type ILicenseBlock<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: LicenseOption[];
  label: string;
};
export function LicenseBlock<T extends FieldValues>(props: ILicenseBlock<T>) {
  const { control, name, options, label } = props;
  const { field } = useController({ name, control });

  return (
    <WithLabel label={label}>
      <RadioGroup
        value={field.value ?? ""}
        onValueChange={field.onChange}
        className={cn("flex flex-col gap-2 w-full")}
      >
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            className="w-full h-12 border border-neutral-300 hover:bg-neutral-100 rounded-full flex items-center justify-between pl-6 pr-2 cursor-pointer transition-colors outline-none data-checked:bg-neutral-50"
          >
            <span className="text-base font-normal text-neutral-700">
              {option.label}
            </span>
            <div className="size-6 flex-center border border-neutral-300 bg-white rounded-full overflow-hidden">
              <Radio.Indicator className="size-full flex-center bg-neutral-800 rounded-full">
                <CheckIcon className="size-4 stroke-2 text-white" />
              </Radio.Indicator>
            </div>
          </Radio.Root>
        ))}
      </RadioGroup>
    </WithLabel>
  );
}