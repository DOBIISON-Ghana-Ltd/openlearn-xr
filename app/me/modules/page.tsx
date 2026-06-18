'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppShell } from '@/components/layout/app-shell'
import { BeakerIcon } from 'lucide-react'

const MOCK_MODULES = [
  {
    id: 'circuit-lab',
    title: 'Electric Circuits',
    subject: 'Physics',
    description: 'Build series and parallel circuits to understand current, voltage, and Ohm\'s Law.',
    difficulty: 'Medium' as const,
  },
  {
    id: 'titration-lab',
    title: 'Acid-Base Titration',
    subject: 'Chemistry',
    description: 'Determine the concentration of an unknown acid using indicators and titration.',
    difficulty: 'Hard' as const,
  },
  {
    id: 'mitosis-lab',
    title: 'Cell Division (Mitosis)',
    subject: 'Biology',
    description: 'Observe phases of mitosis and identify chromosome behaviors.',
    difficulty: 'Easy' as const,
  },
  {
    id: 'pendulum-lab',
    title: 'Pendulum Motion',
    subject: 'Physics',
    description: 'Analyze period, velocity, and gravity impacts on a simple pendulum.',
    difficulty: 'Easy' as const,
  },
]

export default function ExploreModulesPage() {
  return (
    <AppShell title="Explore Modules">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">Science Lab Simulations</h2>
          <p className="text-sm text-muted-foreground mt-1">Select a laboratory simulation to start conducting experiments.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_MODULES.map((mod) => (
            <Card key={mod.id} className="h-full flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{mod.subject}</Badge>
                  <Badge variant={mod.difficulty === 'Hard' ? 'destructive' : mod.difficulty === 'Medium' ? 'warning' : 'success'}>
                    {mod.difficulty}
                  </Badge>
                </div>
                <CardTitle>{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href={`/play/3d/${mod.id}`} className="w-full">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <BeakerIcon className="size-4" />
                    Launch Lab
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
