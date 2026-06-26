import { Footer } from '@/components/app/footer'
import Header from '@/components/app/header'
import * as React from 'react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
