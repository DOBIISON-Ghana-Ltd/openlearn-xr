'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/form-field'
import { registerSchema, RegisterInput } from '@/features/auth/schema/auth.schema'
import { signUp } from '@/adapters/auth/client'

export function RegisterClient() {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    setErrorMsg(null)
    setLoading(true)
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: '/app',
        fetchOptions: {
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'An error occurred during sign up')
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
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Once verified, you will be able to sign in and set up your profile.
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Get started with OpenLearn science labs
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
              name="name"
              label="Full Name"
              type="text"
              placeholder="Alice Smith"
              required
            />

            <FormField
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
export default RegisterClient
