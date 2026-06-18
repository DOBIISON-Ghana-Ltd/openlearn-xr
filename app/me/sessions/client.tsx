'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { UsersIcon, PlusIcon, KeyIcon } from 'lucide-react'

export function SessionsClient() {
  const [code, setCode] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('active')

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    alert(`Joining session with code: ${code}`)
  }

  const handleCreate = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    alert(`Hosted new session! Code is: ${randomCode}`)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Lab Sessions</h2>
          <p className="text-sm text-muted-foreground mt-1">Host group sessions or join an active class lab.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Join Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Join a Lab</CardTitle>
            <CardDescription>Enter the session code provided by your teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                placeholder="E.g. A3BC9R"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center font-mono tracking-widest text-lg h-11"
                maxLength={6}
              />
              <Button type="submit" className="w-full flex items-center justify-center gap-2">
                <KeyIcon className="size-4" />
                Join Session
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Sessions</TabsTrigger>
                <TabsTrigger value="past">Past / Played</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <Empty className="py-12 border border-dashed border-border rounded-xl bg-neutral-50/50 dark:bg-neutral-900/10">
                  <EmptyHeader>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 mb-4">
                      <UsersIcon className="size-5" />
                    </span>
                    <EmptyTitle>No Active Sessions</EmptyTitle>
                    <EmptyDescription>
                      Ask your teacher for a session code to join.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>

              <TabsContent value="past">
                <Empty className="py-12 border border-dashed border-border rounded-xl bg-neutral-50/50 dark:bg-neutral-900/10">
                  <EmptyHeader>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 mb-4">
                      <UsersIcon className="size-5" />
                    </span>
                    <EmptyTitle>No Past Sessions</EmptyTitle>
                    <EmptyDescription>
                      You haven't participated in or completed any group lab sessions yet.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default SessionsClient
