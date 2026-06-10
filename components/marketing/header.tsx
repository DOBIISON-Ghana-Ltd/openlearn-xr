import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { MarketingButton } from '@/components/marketing/button'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: 'oklch(0.965 0.008 95)', borderColor: 'oklch(0.87 0.010 95)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
          <Image
            src="/brand/logo-light.png"
            alt="OpenLearn"
            width={140}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Join a Session */}
        <MarketingButton href={ROUTES.APP.SESSIONS} variant="outline" size="sm">
          Join a Session
        </MarketingButton>
      </div>
    </header>
  )
}