import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: ROUTES.LEGAL.PRIVACY },
  { label: 'Terms of Use', href: ROUTES.LEGAL.TERMS },
  { label: 'Cookie Policy', href: ROUTES.LEGAL.COOKIES },
]

const RESOURCE_LINKS = [
  { label: 'GitHub Repository', href: 'https://github.com/open-learn-xr', external: true },
  { label: 'Contact School Setup', href: ROUTES.CONTACT, external: false },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-start gap-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <Image
                src="/brand/logo-light.png"
                alt="OpenLearn"
                width={120}
                height={30}
                className="h-7 w-auto object-contain dark:invert"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Open-source, personalized curriculum and labs for classrooms worldwide. 
              Deploy locally, ensure student privacy.
            </p>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
              Resources
            </p>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-10 h-px bg-border" />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OpenLearn. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Safe for classrooms · Student data privacy compliant
          </p>
        </div>
      </div>
    </footer>
  )
}