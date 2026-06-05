import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface FormSelectProps {
  name: string
  label?: string
  description?: string
  placeholder?: string
  options: { value: string; label: string }[]
}

export function FormSelect({ name, label, description, placeholder, options }: FormSelectProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className="w-full" aria-invalid={!!error}>
          {label && <FieldLabel>{label}</FieldLabel>}
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  )
}
