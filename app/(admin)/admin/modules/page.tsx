'use client'

import * as React from 'react'
import { AdminShell } from '@/components/layout/admin-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs'
import { toastManager } from '@/components/ui/toast'
import { BeakerIcon, CheckCircle2Icon, XCircleIcon, AlertCircleIcon } from 'lucide-react'

export default function AdminModulesPage() {
  const [modules, setModules] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  const fetchModules = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/modules')
      const payload = await res.json()
      if (payload.status === 'success') {
        setModules(payload.data.modules || [])
      } else {
        toastManager.add({
          title: 'Error',
          description: payload.message || 'Failed to fetch modules',
          type: 'error',
        })
      }
    } catch (error) {
      toastManager.add({
        title: 'Error',
        description: 'Failed to connect to server',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const updateModuleStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/modules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const payload = await res.json()

      if (payload.status === 'success') {
        toastManager.add({
          title: 'Success',
          description: `Module marked as ${status}`,
          type: 'success',
        })
        // Update state locally
        setModules(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      } else {
        toastManager.add({
          title: 'Error',
          description: payload.message || 'Failed to update module status',
          type: 'error',
        })
      }
    } catch (err) {
      toastManager.add({
        title: 'Error',
        description: 'Failed to update module',
        type: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Manage Modules">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8 text-amber-600 dark:text-amber-500" />
            <p className="text-sm text-muted-foreground font-medium">Loading modules...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  const pendingModules = modules.filter(m => m.status === 'pending')
  const approvedModules = modules.filter(m => m.status === 'approved')
  const rejectedModules = modules.filter(m => m.status === 'rejected')

  const renderModuleCard = (mod: any) => {
    const isUpdating = updatingId === mod.id
    return (
      <Card key={mod.id} className="h-full flex flex-col justify-between shadow-xs">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{mod.subject}</Badge>
            <Badge
              variant={
                mod.status === 'approved'
                  ? 'success'
                  : mod.status === 'rejected'
                  ? 'destructive'
                  : 'warning'
              }
            >
              {mod.status}
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold">{mod.title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            By <span className="font-semibold text-foreground">{mod.author}</span> &middot; {mod.difficulty}
          </CardDescription>
          <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
            {mod.description}
          </p>
        </CardHeader>
        <CardFooter className="pt-2 border-t border-border/50 gap-2">
          {mod.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={isUpdating}
                onClick={() => updateModuleStatus(mod.id, 'approved')}
              >
                <CheckCircle2Icon className="size-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                disabled={isUpdating}
                onClick={() => updateModuleStatus(mod.id, 'rejected')}
              >
                <XCircleIcon className="size-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {mod.status === 'approved' && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-rose-700 border-rose-200 hover:bg-rose-50 hover:text-rose-800 dark:text-rose-400 dark:border-rose-950/20 dark:hover:bg-rose-950/20"
              disabled={isUpdating}
              onClick={() => updateModuleStatus(mod.id, 'rejected')}
            >
              <XCircleIcon className="size-4 mr-1" />
              Revoke &amp; Reject
            </Button>
          )}

          {mod.status === 'rejected' && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:border-emerald-950/20 dark:hover:bg-emerald-950/20"
              disabled={isUpdating}
              onClick={() => updateModuleStatus(mod.id, 'approved')}
            >
              <CheckCircle2Icon className="size-4 mr-1" />
              Approve Module
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <AdminShell title="Manage Modules">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Module Approvals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review and publish lab simulations to the main application explorer.
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList variant="underline" className="border-b border-border w-full justify-start gap-6 rounded-none bg-transparent p-0">
            <TabsTab value="pending" className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400 py-3 rounded-none">
              Pending Approval ({pendingModules.length})
            </TabsTab>
            <TabsTab value="approved" className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400 py-3 rounded-none">
              Approved ({approvedModules.length})
            </TabsTab>
            <TabsTab value="rejected" className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400 py-3 rounded-none">
              Rejected ({rejectedModules.length})
            </TabsTab>
            <TabsTab value="all" className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400 py-3 rounded-none">
              All ({modules.length})
            </TabsTab>
          </TabsList>

          <TabsPanel value="pending" className="pt-6">
            {pendingModules.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
                <CheckCircle2Icon className="size-10 text-emerald-600/70 mb-3" />
                <p className="text-sm font-semibold text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">There are no module submissions pending review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pendingModules.map(renderModuleCard)}
              </div>
            )}
          </TabsPanel>

          <TabsPanel value="approved" className="pt-6">
            {approvedModules.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
                <AlertCircleIcon className="size-10 text-muted-foreground/60 mb-3" />
                <p className="text-sm font-semibold text-foreground">No Approved Modules</p>
                <p className="text-xs text-muted-foreground mt-1">No modules have been approved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {approvedModules.map(renderModuleCard)}
              </div>
            )}
          </TabsPanel>

          <TabsPanel value="rejected" className="pt-6">
            {rejectedModules.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
                <AlertCircleIcon className="size-10 text-muted-foreground/60 mb-3" />
                <p className="text-sm font-semibold text-foreground">No Rejected Modules</p>
                <p className="text-xs text-muted-foreground mt-1">There are no rejected modules in the archive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rejectedModules.map(renderModuleCard)}
              </div>
            )}
          </TabsPanel>

          <TabsPanel value="all" className="pt-6">
            {modules.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
                <BeakerIcon className="size-10 text-muted-foreground/60 mb-3" />
                <p className="text-sm font-semibold text-foreground">No Modules Registered</p>
                <p className="text-xs text-muted-foreground mt-1">No lab modules exist in the catalog.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map(renderModuleCard)}
              </div>
            )}
          </TabsPanel>
        </Tabs>
      </div>
    </AdminShell>
  )
}
