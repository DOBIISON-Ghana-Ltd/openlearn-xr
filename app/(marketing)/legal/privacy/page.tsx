import * as React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | OpenLearn',
  description: 'Privacy Policy describing how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: June 3, 2026</p>
      
      <div className="prose prose-emerald dark:prose-invert mt-8 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect personal information such as your name, email address, and role during registration and onboarding. We also collect usage data when you perform virtual laboratory simulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. How We Use Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use your data to manage your account, provide grading reports, and analyze usage metrics to improve our simulations. We never sell your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Cookie Policy & Tracking</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use analytical cookies (PostHog and Google Analytics) to improve user experience, but we only load tracking cookies after obtaining your explicit consent via the consent banner.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@openlearn.app.
          </p>
        </section>
      </div>
    </div>
  )
}
