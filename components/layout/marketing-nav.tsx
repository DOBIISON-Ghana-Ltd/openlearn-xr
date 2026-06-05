'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from '@/adapters/auth/client'

export function MarketingNav() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-sm">
              O
            </span>
            OpenLearn
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
              How it Works
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/app">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
