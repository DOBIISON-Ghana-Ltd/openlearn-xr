'use client'

import * as React from 'react'
import { AdminShell } from '@/components/layout/admin-shell'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { toastManager } from '@/components/ui/toast'
import { useSession } from '@/adapters/auth/client'
import {
  UsersIcon,
  SearchIcon,
  Trash2Icon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from 'lucide-react'

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [actionId, setActionId] = React.useState<string | null>(null)

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users')
      const payload = await res.json()
      if (payload.status === 'success') {
        setUsers(payload.data.users || [])
      } else {
        toastManager.add({
          title: 'Error',
          description: payload.message || 'Failed to fetch users',
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
    fetchUsers()
  }, [fetchUsers])

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    setActionId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })
      const payload = await res.json()

      if (payload.status === 'success') {
        toastManager.add({
          title: 'Success',
          description: `User role updated to ${role}`,
          type: 'success',
        })
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
      } else {
        toastManager.add({
          title: 'Error',
          description: payload.message || 'Failed to update user role',
          type: 'error',
        })
      }
    } catch (err) {
      toastManager.add({
        title: 'Error',
        description: 'Failed to update role',
        type: 'error',
      })
    } finally {
      setActionId(null)
    }
  }

  const deleteUser = async (userId: string, userName: string) => {
    if (userId === session?.user?.id) {
      toastManager.add({
        title: 'Validation Error',
        description: 'You cannot delete your own admin account',
        type: 'error',
      })
      return
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    setActionId(userId)
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      })
      const payload = await res.json()

      if (payload.status === 'success') {
        toastManager.add({
          title: 'Deleted',
          description: `User "${userName}" deleted successfully`,
          type: 'success',
        })
        setUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        toastManager.add({
          title: 'Error',
          description: payload.message || 'Failed to delete user',
          type: 'error',
        })
      }
    } catch (err) {
      toastManager.add({
        title: 'Error',
        description: 'Failed to delete user',
        type: 'error',
      })
    } finally {
      setActionId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.userRole || '').toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <AdminShell title="Manage Users">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8 text-amber-600 dark:text-amber-500" />
            <p className="text-sm text-muted-foreground font-medium">Loading user database...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Manage Users">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Administration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse users, elevate permissions, or moderate user accounts.
          </p>
        </div>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4 border-b border-border/50">
            <div>
              <CardTitle className="text-lg">Database Records</CardTitle>
              <CardDescription className="text-xs">
                Currently showing {filteredUsers.length} of {users.length} users.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UsersIcon className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm font-medium">No matching records found</p>
                <p className="text-xs mt-0.5">Try adjusting your search filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-4 pl-6">User Details</TableHead>
                    <TableHead className="py-4">Onboarding Role</TableHead>
                    <TableHead className="py-4">System Permissions</TableHead>
                    <TableHead className="py-4">Verified</TableHead>
                    <TableHead className="py-4">Joined</TableHead>
                    <TableHead className="py-4 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => {
                    const isSelf = user.id === session?.user?.id
                    const isBusy = actionId === user.id
                    const initials = user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)

                    return (
                      <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="py-3 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 font-bold text-xs dark:bg-amber-950/20 dark:text-amber-400 border border-amber-600/10">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                {user.name}
                                {isSelf && (
                                  <Badge variant="outline" size="sm" className="text-3xs px-1 py-0 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset capitalize bg-muted text-muted-foreground ring-muted/20">
                            {user.userRole || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            {user.role === 'admin' ? (
                              <Badge variant="default" className="bg-amber-700 hover:bg-amber-850 text-white font-semibold">
                                <ShieldCheckIcon className="size-3.5 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-medium">
                                User
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          {user.emailVerified ? (
                            <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <XCircleIcon className="size-4 text-muted-foreground/60" />
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.role === 'admin' ? (
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={isBusy || isSelf}
                                onClick={() => updateUserRole(user.id, 'user')}
                              >
                                <ShieldAlertIcon className="size-3.5 mr-1 text-amber-600" />
                                Demote
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                className="border-amber-600/20 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/20"
                                disabled={isBusy}
                                onClick={() => updateUserRole(user.id, 'admin')}
                              >
                                <ShieldCheckIcon className="size-3.5 mr-1" />
                                Promote
                              </Button>
                            )}
                            <Button
                              size="xs"
                              variant="destructive"
                              disabled={isBusy || isSelf}
                              onClick={() => deleteUser(user.id, user.name)}
                            >
                              <Trash2Icon className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
