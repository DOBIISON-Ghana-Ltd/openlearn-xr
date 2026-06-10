import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import * as React from 'react'

type Variant = 'primary' | 'outline'
type Size = 'sm' | 'default' | 'lg'

interface MarketingButtonProps {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

// These are the ONLY styles that control the chunky Duolingo look.
// No COSS base classes, no CVA, no tailwind-merge conflicts.

const BASE =
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 font-bold leading-none border border-b-4 transition-all active:translate-y-[3px] active:border-b'

const SIZES: Record<Size, string> = {
  sm:      'rounded-xl px-4 py-2 text-sm',
  default: 'rounded-2xl px-6 py-3 text-sm',
  lg:      'rounded-2xl px-8 py-4 text-base',
}

// Background + text use CSS variable tokens (from globals.css) so they
// pick up theme changes. Border colors are bespoke — slightly darker
// than the background on top/sides, darker still on the bottom for depth.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:brightness-105',
  outline: 'bg-card text-foreground hover:bg-muted',
}

// Border colors are explicit OKLCH values because they need to be
// slightly different from the standard --border token.
const BORDER_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    borderTopColor:    'oklch(0.60 0.22 145)',
    borderLeftColor:   'oklch(0.60 0.22 145)',
    borderRightColor:  'oklch(0.60 0.22 145)',
    borderBottomColor: 'oklch(0.52 0.26 145)',
  },
  outline: {
    borderTopColor:    'oklch(0.87 0.010 95)',
    borderLeftColor:   'oklch(0.87 0.010 95)',
    borderRightColor:  'oklch(0.87 0.010 95)',
    borderBottomColor: 'oklch(0.70 0.010 95)',
  },
}

export function MarketingButton({
  href,
  variant = 'primary',
  size = 'default',
  className,
  children,
}: MarketingButtonProps) {
  const cls = cn(BASE, SIZES[size], VARIANT_CLASSES[variant], className)
  const style = BORDER_STYLES[variant]

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} style={style}>
      {children}
    </button>
  )
}
