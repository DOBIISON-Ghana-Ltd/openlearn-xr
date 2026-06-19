'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 select-none">

        {/* Illustration */}
        <div className="relative flex items-center justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Dashed arcs — outermost */}
            <path
              d="M10 40 A30 30 0 0 1 40 10"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 5"
            />
            <path
              d="M70 40 A30 30 0 0 0 40 10"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 5"
            />
            {/* Dashed arcs — middle */}
            <path
              d="M18 40 A22 22 0 0 1 40 18"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            <path
              d="M62 40 A22 22 0 0 0 40 18"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            {/* Dashed arcs — inner */}
            <path
              d="M26 40 A14 14 0 0 1 40 26"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 3"
            />
            <path
              d="M54 40 A14 14 0 0 0 40 26"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 3"
            />
            {/* Vertical line of exclamation */}
            <line x1="40" y1="34" x2="40" y2="48" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            {/* Dot of exclamation */}
            <circle cx="40" cy="55" r="1.5" fill="#d1d5db" />
            {/* Bottom dot (ground) */}
            <circle cx="40" cy="70" r="1.5" fill="#d1d5db" />
          </svg>
        </div>

        {/* Labels */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium tracking-wide text-foreground">
            something_went_wrong
          </span>
          <span className="text-xs text-muted-foreground tracking-wide">
            an_unexpected_error_occurred
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={reset}
          className="mt-1 px-10 py-2.5 rounded-full border border-border bg-background text-sm font-mono font-medium text-foreground hover:bg-muted transition-colors"
        >
          try_again
        </button>
      </div>
    </div>
  )
}
