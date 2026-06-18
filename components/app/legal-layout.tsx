import * as React from 'react'
import type { LegalContent } from '@/lib/constants/legal'

interface LegalLayoutProps {
  content: LegalContent
}

export function LegalLayout({ content }: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* Centered title */}
      <h1 className="text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {content.title}
      </h1>

      {/* Divider */}
      <hr className="mt-8 border-border" />

      {/* Last updated */}
      <p className="mt-8 text-sm text-muted-foreground">
        Last updated {content.lastUpdated}
      </p>

      {/* Intro paragraphs */}
      <div className="mt-6 space-y-4">
        {content.intro.map((para, i) => (
          <p key={i} className="text-base leading-relaxed text-muted-foreground">
            {para}
          </p>
        ))}
      </div>

      {/* Sections */}
      <div className="mt-8 space-y-8">
        {content.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            {section.title && (
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl mt-8">
                {section.title}
              </h2>
            )}

            {section.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                className="whitespace-pre-line text-base leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="list-disc space-y-2 pl-6 text-base text-muted-foreground">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
