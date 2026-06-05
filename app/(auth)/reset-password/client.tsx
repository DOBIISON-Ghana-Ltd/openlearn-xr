'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/form-field'
import { resetPasswordSchema, ResetPasswordInput } from '@/features/auth/schema/auth.schema'
import { authClient } from '@/adapters/auth/client'

export function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setErrorMsg('Invalid or missing reset token. Please request a new link.')
      return
    }

    setErrorMsg(null)
    setLoading(true)
    try {
      await authClient.resetPassword({
        newPassword: data.password,
        token: token,
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

  if (!token) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Invalid Reset Link</CardTitle>
          <CardDescription>
            The password reset token is missing or invalid. Please check your email or request a new reset link.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Request new link
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Password reset successful</CardTitle>
          <CardDescription>
            Your password has been successfully updated. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Go to Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below.
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
              name="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <FormField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Reset Password
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
export default ResetPasswordClient
