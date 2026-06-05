import * as React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | OpenLearn',
  description: 'Cookie Policy explaining how we use cookies on our educational platform.',
}

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Cookie Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: June 3, 2026</p>
      
      <div className="prose prose-emerald dark:prose-invert mt-8 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. What Are Cookies?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cookies are small text files stored on your browser when you visit websites. We use cookies to make our platform work, remember your login session, and analyze platform performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Types of Cookies We Use</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use two main types of cookies:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground leading-relaxed">
            <li><strong>Essential Cookies:</strong> Required to sign in and persist your session (Better Auth uses secure cookies for this).</li>
            <li><strong>Analytics Cookies:</strong> Optional cookies loaded via Google Analytics and PostHog to analyze page views and simulation activity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Managing Cookie Consent</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Upon your first visit, we display a cookie consent banner. If you click "Accept", optional analytics cookies are loaded. If you click "Deny", only essential session cookies are used.
          </p>
        </section>
      </div>
    </div>
  )
}
