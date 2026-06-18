'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Subject, Module } from '@/lib/constants/data'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Play, Lock, CheckCircle2, BadgeCheckIcon } from 'lucide-react'
import { Badge } from '../ui/badge'

// Subject accent colours (used for the grainy banner tones)
const SUBJECT_ACCENTS: Record<Subject, { from: string; to: string }> = {
  Chemistry: { from: '#6ee7b7', to: '#10b981' },
  Physics: { from: '#93c5fd', to: '#3b82f6' },
  Biology: { from: '#fda4af', to: '#f43f5e' },
}

function bannerStyle(subject: Subject): React.CSSProperties {
  const { from, to } = SUBJECT_ACCENTS[subject] || SUBJECT_ACCENTS['Chemistry']
  return {
    backgroundImage: [
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
      `radial-gradient(ellipse at 30% 60%, ${from} 0%, ${to} 100%)`,
    ].join(', '),
  }
}

export type PlayMode = 'session' | 'module' | 'library'

export interface ModuleCardProps {
  module: Module
  hasLicense?: boolean
  playMode?: PlayMode
}

export function ModuleCard({ module, hasLicense = false, playMode = 'session' }: ModuleCardProps) {
  const { id, title, subject, grade, totalCheckpoints, isCompleted, isLocked } = module

  return (
    <div
      className='relative p-2.5 flex flex-col rounded-3xl border bg-card overflow-hidden shadow-lg'
      id={`module-card-${id}`}
    >
      {/* ── Banner (grainy gradient) ── */}
      <div
        className="relative h-32 rounded-xl overflow-hidden"
        style={bannerStyle(subject)}
      />

      {/* ── Body ── */}
      <div className="flex flex-col gap-1 pt-5 flex-1 justify-between space-y-1">
        <div className='space-y-6 px-1'>
          <div className="space-y-0.5">
            <h3 className="text-base font-medium text-foreground leading-tight line-clamp-1">{title}</h3>
            <p className="text-sm font-medium text-muted-foreground">{subject} • {grade}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Checkpoints */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-foreground shrink-0">
                {totalCheckpoints}
              </span>
              <span className="text-sm font-medium text-muted-foreground shrink-0">
                checkpoints
              </span>
            </div>

            {/* Verified Chip */}
            {isCompleted && (
              <Badge variant="success" className="rounded-full">
                <BadgeCheckIcon /> Verified
              </Badge>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div>
          {isLocked ? (
            <Button
              className="w-full rounded-full bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
              variant="outline"
              size="lg"
              disabled
            >
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </Button>
          ) : hasLicense ? (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 rounded-full"
                variant="default"
                size="lg"
                id={`host-${id}`}
                render={<Link href={ROUTES.PLAY('host', id)} />}
              >
                Host
              </Button>
              <Button
                className="aspect-square rounded-full p-0 flex items-center justify-center w-11 h-11 shrink-0"
                variant="outline"
                size="lg"
                id={`play-${id}`}
                render={<Link href={ROUTES.PLAY(playMode, id)} />}
              >
                <Play className="h-5 w-5 fill-current text-foreground" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full rounded-full"
              variant="default"
              size="lg"
              id={`play-${id}`}
              render={<Link href={ROUTES.PLAY(playMode, id)} />}
            >
              Play
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
