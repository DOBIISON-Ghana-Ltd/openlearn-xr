import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input, InputProps } from '@/components/ui/input'

interface FormFieldProps extends Omit<InputProps, 'name'> {
  name: string
  label?: string
  description?: string
  children?: React.ReactNode
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ name, label, description, type = 'text', placeholder, children, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext()

    const error = errors[name]
    const errorMessage = error?.message as string | undefined

    return (
      <Field className="w-full" aria-invalid={!!error}>
        {label && <FieldLabel>{label}</FieldLabel>}
        {children ? (
          children
        ) : (
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name)}
            {...props}
            ref={ref}
          />
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </Field>
    )
  }
)

FormField.displayName = 'FormField'
