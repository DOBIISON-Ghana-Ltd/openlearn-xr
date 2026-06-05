import * as React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-emerald-50 via-neutral-50 to-emerald-100/50 p-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-primary transition-opacity hover:opacity-85">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
              O
            </span>
            OpenLearn
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
