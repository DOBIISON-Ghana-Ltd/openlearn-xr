'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, PlayIcon } from 'lucide-react'

const MOCK_PLAYS = [
  {
    id: 'play-1',
    moduleTitle: 'Electric Circuits',
    subject: 'Physics',
    score: '10/10',
    date: '2026-06-01',
    status: 'Completed',
  },
  {
    id: 'play-2',
    moduleTitle: 'Pendulum Motion',
    subject: 'Physics',
    score: '8/10',
    date: '2026-05-28',
    status: 'Completed',
  },
]

export function MyPlaysClient() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">My Lab Plays</h2>
        <p className="text-sm text-muted-foreground mt-1">Review your completed lab runs, checkpoints, and scores.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lab Module</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Checkpoints Passed</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PLAYS.map((play) => (
                <TableRow key={play.id}>
                  <TableCell className="font-semibold text-foreground">{play.moduleTitle}</TableCell>
                  <TableCell>{play.subject}</TableCell>
                  <TableCell>{play.score}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon className="size-3.5" aria-hidden="true" />
                      {play.date}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">{play.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/play/3d/${play.id}`}>
                      <Button size="xs" variant="outline" className="flex items-center gap-1">
                        <PlayIcon className="size-3" aria-hidden="true" />
                        Replay
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
export default MyPlaysClient
