import * as React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | OpenLearn',
  description: 'Terms of Service and conditions for using the OpenLearn platform.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: June 3, 2026</p>
      
      <div className="prose prose-emerald dark:prose-invert mt-8 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using the OpenLearn platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Description of Service</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            OpenLearn provides interactive 3D science simulations for educational purposes. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. User Accounts</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Governing Law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction of our operation, without regard to conflict of law principles.
          </p>
        </section>
      </div>
    </div>
  )
}
