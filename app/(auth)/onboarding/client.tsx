'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, Radio } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from '@/server/actions/onboarding'
import { useSession } from '@/adapters/auth/client'
import { GraduationCapIcon, BookOpenIcon, ArrowRightIcon } from 'lucide-react'

export function OnboardingClient() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [step, setStep] = React.useState(1)
  const [role, setRole] = React.useState<'teacher' | 'student'>('student')
  const [loading, setLoading] = React.useState(false)

  const handleNext = () => {
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await completeOnboarding(role)
      if (update) {
        await update()
      }
      router.push('/app')
      router.refresh()
    } catch (err) {
      alert('An error occurred during onboarding. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {step === 1 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to OpenLearn!</CardTitle>
            <CardDescription className="text-center">
              We are excited to have you join our science learning community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center py-6">
            <div className="flex justify-center mb-4">
              <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <BookOpenIcon className="size-8" />
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              OpenLearn delivers interactive 3D science simulations right in your browser.
              Let's complete a quick profile setup to get you started.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNext} className="w-full">
              Get Started
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>What is your role?</CardTitle>
            <CardDescription>
              We'll customize your dashboard based on how you plan to use OpenLearn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <RadioGroup
              value={role}
              onValueChange={(val) => setRole(val as 'teacher' | 'student')}
              className="gap-4"
            >
              <Label
                htmlFor="role-student"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                  role === 'student'
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-border'
                }`}
              >
                <Radio value="student" id="role-student" />
                <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <GraduationCapIcon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">I'm a Student</p>
                  <p className="text-xs text-muted-foreground">I want to run science labs and complete assignments.</p>
                </div>
              </Label>

              <Label
                htmlFor="role-teacher"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                  role === 'teacher'
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-border'
                }`}
              >
                <Radio value="teacher" id="role-teacher" />
                <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <BookOpenIcon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">I'm a Teacher / Host</p>
                  <p className="text-xs text-muted-foreground">I want to host laboratory sessions and track student progress.</p>
                </div>
              </Label>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex gap-3 justify-between border-t border-border pt-4">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ready to explore!</CardTitle>
            <CardDescription>
              Your profile is configured. Here is what you can do next:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-400 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium">Explore Interactive Labs</p>
                  <p className="text-xs text-muted-foreground">Browse science modules covering physics, chemistry, and biology.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-400 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium">Track Your Achievements</p>
                  <p className="text-xs text-muted-foreground">Record your simulation progress and unlock badges as you complete tasks.</p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex gap-3 justify-between border-t border-border pt-4">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Enter Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
export default OnboardingClient
