'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useApi from '@/data/hooks/use-api'
import { CreditCardIcon, SparklesIcon, CheckCircle2Icon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/adapters/auth/client'

export function LicenseClient() {
  const { data: activeOrg, isPending: isOrgPending } = authClient.useActiveOrganization()
  const { data: subscription, isPending: isSubPending } = useApi.query(
    "public:org:get:subscription",
    activeOrg?.id ?? "",
    !!activeOrg?.id
  )

  const isPending = isOrgPending || isSubPending
  const isSubscribed = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING"
  const tierName = subscription?.tier || "FREE"

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">Organization License</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your organization's subscription and billing details.</p>
      </div>

      {isPending ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current License Card */}
          <Card className={isSubscribed ? "border-emerald-500 shadow-md shadow-emerald-500/10" : ""}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Current Plan
                    {isSubscribed && (
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Organization: <span className="font-medium text-foreground">{activeOrg?.name}</span>
                  </CardDescription>
                </div>
                <div className="p-2 bg-secondary rounded-lg">
                  <CreditCardIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 border-t pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold">{tierName} Plan</span>
                <span className="text-sm text-muted-foreground">
                  {isSubscribed ? "Billed annually. Next billing date: Jan 1, 2027" : "Free basic access for individuals."}
                </span>
              </div>

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="size-4 text-emerald-500" />
                  <span>Access to all free modules</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="size-4 text-emerald-500" />
                  <span>Personal progress tracking</span>
                </li>
                {isSubscribed && (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2Icon className="size-4 text-emerald-500" />
                      <span className="font-medium">Module Editor & Builder</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2Icon className="size-4 text-emerald-500" />
                      <span className="font-medium">Host Live Sessions</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
            <CardFooter className="bg-sidebar py-4 border-t">
              <Button variant="outline" className="w-full">
                Manage Billing
              </Button>
            </CardFooter>
          </Card>

          {/* Upgrade CTA */}
          {!isSubscribed && (
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 flex flex-col">
              <CardHeader>
                <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2">
                  <SparklesIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-emerald-800 dark:text-emerald-300">Upgrade to Pro</CardTitle>
                <CardDescription className="text-emerald-700/80 dark:text-emerald-400/80">
                  Unlock the full potential of OpenLearn XR for your classroom.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-emerald-800/90 dark:text-emerald-300/90">
                  Get access to the Module Editor to create custom interactive 3D labs, and host Live Sessions with your students in real-time.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  View Pricing Options
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
