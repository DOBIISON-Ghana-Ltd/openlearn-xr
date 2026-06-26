'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { label: 'Library', href: ROUTES.SIMS.LIBRARY.ROOT },
  { label: 'Modules', href: ROUTES.SIMS.MODULES },
  { label: 'Licensing', href: ROUTES.LICENSING },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
          <Image
            src="/brand/logo-light.png"
            alt="OpenLearn"
            width={140}
            height={36}
            priority
            className="h-8 w-auto object-contain dark:invert"
          />
        </Link>

        {/* Middle: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Button render={<Link href={ROUTES.SIMS.PLAY('session')} />} className="hidden sm:inline-flex rounded-full">
            Play Session
          </Button>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 top-16">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t">
            <Button render={<Link href={ROUTES.SIMS.PLAY('session')} />} className="w-full rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
              Play Session
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}