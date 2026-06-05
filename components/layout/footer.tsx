import * as React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-neutral-50 py-12 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-xs">
              O
            </span>
            OpenLearn
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OpenLearn. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <Link href="/legal/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
