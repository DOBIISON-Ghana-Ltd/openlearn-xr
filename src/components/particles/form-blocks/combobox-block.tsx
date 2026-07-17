"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

type Item = { label: string; value: string };

type Props<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: Path<T>;
  items: Item[];
  placeholder?: string;
};

export default function ComboboxBlock<T extends FieldValues>({
  label,
  control,
  name,
  items,
  placeholder = "Select…",
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.error ? "true" : undefined} className="gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        items={items}
        value={items.find((i) => i.value === field.value) ?? null}
        onValueChange={(item: Item | null) => field.onChange(item?.value ?? "")}
        itemToStringLabel={(item: Item) => item.label}
      >
        <ComboboxInput
          placeholder={placeholder}
          className="w-full text-sm"
          onBlur={field.onBlur}
        />
        <ComboboxPopup>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {(item: Item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  );
}
