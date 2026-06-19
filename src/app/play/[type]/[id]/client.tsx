'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeftIcon, CheckCircle2Icon, FlaskConicalIcon } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

// ─── Code Gate ───────────────────────────────────────────────────────────────

function SessionCodeGate() {
  const router = useRouter()
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a session code.')
      return
    }
    router.push(ROUTES.PLAY('session', trimmed))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleJoin()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white p-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => router.back()}
        className="absolute top-5 left-5 text-neutral-400 hover:text-white"
      >
        <ArrowLeftIcon className="size-4" />
        <span className="sr-only">Go back</span>
      </Button>

      <div className="w-full max-w-sm space-y-8">
        {/* Icon */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-900/50 border border-emerald-500/20 text-emerald-400">
            <FlaskConicalIcon className="size-8" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Join Lab Session</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Enter the session code given by your teacher.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <input
            id="session-code-input"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. ABC123"
            maxLength={12}
            autoComplete="off"
            spellCheck={false}
            className="w-full h-13 rounded-2xl border border-neutral-700 bg-neutral-900 px-5 text-center text-xl font-mono font-semibold tracking-[0.25em] text-white placeholder:text-neutral-600 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
        </div>

        {/* CTA */}
        <Button
          id="join-session-btn"
          onClick={handleJoin}
          className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-colors"
          size="lg"
        >
          Join Session
        </Button>
      </div>
    </div>
  )
}

// ─── Lab Shell ────────────────────────────────────────────────────────────────

function LabShell({ type, id }: { type: string; id: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [answer, setAnswer] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <Spinner className="size-10 text-emerald-500 mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
          Loading 3D Lab Environment...
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Exit Lab</span>
          </Button>
          <h1 className="font-semibold text-sm">Lab ID: {id}</h1>
        </div>
        <div className="text-xs text-neutral-400">Mode: {type}</div>
      </header>

      {/* 16:9 Canvas */}
      <div className="relative w-full aspect-video md:max-h-[60vh] bg-radial from-emerald-950 via-neutral-950 to-neutral-950 flex items-center justify-center border-b border-neutral-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="flex flex-col items-center text-center px-4 relative z-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-400 mb-4 border border-emerald-500/20">
            <CheckCircle2Icon className="size-6 animate-pulse" />
          </span>
          <h2 className="text-xl font-bold">3D Interactive Lab Canvas</h2>
          <p className="text-sm text-neutral-400 max-w-sm mt-1">
            React Three Fiber (R3F) renderer simulation engine placeholder.
          </p>
        </div>
      </div>

      {/* Checkpoint */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8">
        <Card className="bg-neutral-900 border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Checkpoint 1: Circuit Elements</CardTitle>
            <CardDescription className="text-neutral-400">
              Select the correct statement regarding current in series circuits:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'A) Current is split equally between components.',
              'B) Current remains constant at all points in the circuit.',
              'C) Total current is the sum of component currents.',
              'D) Current decreases after passing through a resistor.',
            ].map((option) => (
              <Button
                key={option}
                variant={answer === option ? 'default' : 'outline'}
                onClick={() => setAnswer(option)}
                className={`w-full justify-start text-left h-auto p-4 rounded-xl border ${
                  answer === option
                    ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-600'
                    : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ClientPage() {
  const params = useParams<{ type: string; id: string }>()
  const type = params.type ?? ''
  const id = params.id ?? ''

  const isSessionGate = type === 'session' && (!id || id === 'undefined')

  if (isSessionGate) {
    return <SessionCodeGate />
  }

  return <LabShell type={type} id={id} />
}
