'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/form-field'
import { forgotPasswordSchema, ForgotPasswordInput } from '@/features/auth/schema/auth.schema'
import { authClient } from '@/adapters/auth/client'

export function ForgotPasswordClient() {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMsg(null)
    setLoading(true)
    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
        fetchOptions: {
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'An error occurred. Please try again.')
            setLoading(false)
          },
          onSuccess: () => {
            setSuccess(true)
            setLoading(false)
          },
        },
      })
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset link sent</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address if it exists in our system. Please check your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            The link is valid for a limited time.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive-foreground">
                {errorMsg}
              </div>
            )}

            <FormField
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Send Reset Link
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
export default ForgotPasswordClient
