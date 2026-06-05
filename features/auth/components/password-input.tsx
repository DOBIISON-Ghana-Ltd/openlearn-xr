'use client'

import * as React from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative w-full">
      <Input
        type={show ? 'text' : 'password'}
        {...props}
        ref={ref}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
      >
        {show ? (
          <EyeOffIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">{show ? 'Hide password' : 'Show password'}</span>
      </Button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'
