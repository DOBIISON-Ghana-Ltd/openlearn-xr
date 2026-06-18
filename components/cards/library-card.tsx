'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { LibraryCollection, Subject } from '@/lib/constants/data'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

// ── Subject accent colours (used only for the grainy banner tones) ──────────
const SUBJECT_ACCENTS: Record<Subject, { from: string; to: string }> = {
  Chemistry: { from: '#6ee7b7', to: '#10b981' },
  Physics: { from: '#93c5fd', to: '#3b82f6' },
  Biology: { from: '#fda4af', to: '#f43f5e' },
}

// Inline grainy-gradient banner style
function bannerStyle(subject: Subject): React.CSSProperties {
  const { from, to } = SUBJECT_ACCENTS[subject]
  return {
    backgroundImage: [
      // SVG noise layer
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
      // Gradient layer
      `radial-gradient(ellipse at 30% 60%, ${from} 0%, ${to} 100%)`,
    ].join(', '),
  }
}

// ── Stacked document cards ───────────────────────────────────────────────────
function DocumentStack() {
  const docs = [
    { rotate: -8, x: -20, y: 14, delay: 0 },
    { rotate: 8, x: 14, y: 0, delay: 0.04 },
    { rotate: 24, x: 36, y: 24, delay: 0.02 },
  ]

  return (
    <div className="relative flex items-end justify-center h-full pb-4">
      {docs.map((d, i) => (
        <div
          key={i}
          style={{
            transform: `translateX(${d.x}px) rotate(${d.rotate}deg) translateY(${d.y}px)`,
            zIndex: docs.length - i
          }}
          className="absolute -bottom-8 w-28 aspect-[9/10] rounded-md bg-card border border-border/60 shadow-sm flex flex-col gap-1.5 px-2 pt-2.5 overflow-hidden"
        >
          {/* Document lines */}
          {new Array(2).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              <div className="h-[3px] w-full rounded-full bg-muted-foreground/20" />
              <div className="h-[3px] w-4/5 rounded-full bg-muted-foreground/15" />
              <div className="h-[3px] w-full rounded-full bg-muted-foreground/20" />
              <div className="h-[3px] w-3/5 rounded-full bg-muted-foreground/15" />
              <div className="h-[3px] w-full rounded-full bg-muted-foreground/20" />
              <div className="h-[3px] w-4/5 rounded-full bg-muted-foreground/10" />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Segmented progress bar ───────────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  const segments = 20;
  const absoluteValue = Math.round(value * segments);

  return (
    <div
      role="progressbar"
      aria-valuenow={absoluteValue}
      aria-valuemin={0}
      aria-valuemax={segments}
      className="flex flex-1 items-center gap-0.5"
    >
      {Array.from({ length: segments }, (_, i) => (
        <motion.div
          key={i}
          className="h-4 flex-1"
          style={{ minWidth: 0 }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            backgroundColor: i < absoluteValue ? 'var(--color-primary)' : 'var(--color-muted)',
          }}
          transition={{ duration: 0.3, delay: i * 0.025, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ── Main card ────────────────────────────────────────────────────────────────
export interface LibraryCardProps {
  collection: LibraryCollection
}

export function LibraryCard({ collection }: LibraryCardProps) {
  const { id, subject, grade, totalModules, totalPlayedModules } = collection

  // Format "03 / 08"
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className='relative p-2.5 flex flex-col rounded-3xl border bg-card overflow-hidden shadow-lg'
      id={`library-card-${collection.id}`}
    >
      {/* ── Banner (grainy gradient + document stack) ── */}
      <div
        className="relative h-32 rounded-xl overflow-hidden"
        style={bannerStyle(subject)}
      >
        <DocumentStack />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-1 pt-5 flex-1">
        <div className='space-y-10 px-1'>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground leading-tight">{subject}</p>
            <p className="text-sm font-medium text-muted-foreground">{grade}</p>
          </div>

          <div className="flex items-center gap-10">
            <p className='flex gap-1 items-baseline'>
              <span className="text-2xl font-semibold text-foreground shrink-0">
                {pad(totalPlayedModules)}
              </span>
              <span className="text-sm font-medium text-muted-foreground shrink-0">
                / {pad(totalModules)}
              </span>
            </p>
            <ProgressBar value={totalPlayedModules / totalModules} />
          </div>
        </div>

        {/* CTA */}
        <Button
          className="w-full rounded-full"
          variant="default"
          size="lg"
          id={`explore-${collection.id}`}
          render={<Link href={ROUTES.LIBRARY.ONE(id)} />}
        >
          Explore
        </Button>
      </div>
    </div>
  )
}
