'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { AppShell } from '@/components/layout/app-shell'
import { MessageSquareIcon } from 'lucide-react'

export default function CommunityPage() {
  return (
    <AppShell title="Community">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <Empty className="py-20 border border-dashed border-border rounded-xl bg-neutral-50/50 dark:bg-neutral-900/10">
            <EmptyHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-6">
                <MessageSquareIcon className="size-6" />
              </span>
              <EmptyTitle className="text-2xl">Community Hub - Coming Soon</EmptyTitle>
              <EmptyDescription className="max-w-md mt-2">
                We are building a collaborative space where students and teachers can share custom module creations, discuss scientific concepts, and request help. Stay tuned!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </AppShell>
  )
}
