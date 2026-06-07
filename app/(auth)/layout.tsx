import { ROUTES } from '@/lib/constants/routes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh px-4 pb-6">
      <div className="w-full max-w-sm mx-auto space-y-20">
        <div className="flex justify-center py-6">
          <Link href={ROUTES.HOME}>
            <Image 
              src="/brand/logo-full.png" 
              alt="Openlearn" 
              width={140} 
              height={38}
              className="w-32 object-contain"
              priority
            />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
