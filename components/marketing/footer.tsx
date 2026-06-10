import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { MarketingButton } from '@/components/marketing/button'

const FOOTER_LINKS = {
  Product: [
    { label: 'Explore Modules', href: ROUTES.APP.MODULES },
    { label: 'Host a Session', href: ROUTES.APP.SESSIONS },
    { label: 'Community', href: ROUTES.APP.COMMUNITY },
    { label: 'My Plays', href: ROUTES.APP.HISTORY },
  ],
  Company: [
    { label: 'Privacy Policy', href: ROUTES.LEGAL.PRIVACY },
    { label: 'Terms of Use', href: ROUTES.LEGAL.TERMS },
    { label: 'Cookie Policy', href: ROUTES.LEGAL.COOKIES },
  ],
  Account: [
    { label: 'Log In', href: ROUTES.LOGIN },
    { label: 'Sign Up', href: ROUTES.REGISTER },
  ],
}

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: 'oklch(0.965 0.008 95)', borderColor: 'oklch(0.87 0.010 95)' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top row: logo + CTA */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <Image
              src="/brand/logo-light.png"
              alt="OpenLearn"
              width={120}
              height={30}
              className="h-7 w-auto object-contain"
            />
          </Link>

          <MarketingButton href={ROUTES.APP.SESSIONS} variant="outline" size="sm">
            Join a Session
          </MarketingButton>
        </div>

        {/* Divider */}
        <div
          className="my-10 h-px"
          style={{ backgroundColor: 'oklch(0.87 0.010 95)' }}
        />

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p
                className="mb-4 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'oklch(0.30 0.012 120)' }}
              >
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: 'oklch(0.50 0.012 120)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="my-10 h-px"
          style={{ backgroundColor: 'oklch(0.87 0.010 95)' }}
        />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs" style={{ color: 'oklch(0.60 0.010 120)' }}>
            © {new Date().getFullYear()} OpenLearn. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'oklch(0.60 0.010 120)' }}>
            🔒 Safe for classrooms · Student data privacy compliant
          </p>
        </div>
      </div>
    </footer>
  )
}