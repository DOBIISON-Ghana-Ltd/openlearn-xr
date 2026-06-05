'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/form-field'
import { loginSchema, LoginInput } from '@/features/auth/schema/auth.schema'
import { signIn } from '@/adapters/auth/client'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/app'

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null)
    setLoading(true)
    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
        fetchOptions: {
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'Invalid email or password')
            setLoading(false)
          },
          onSuccess: () => {
            router.push(callbackUrl)
            router.refresh()
          },
        },
      })
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your OpenLearn account to continue
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

            <div className="flex flex-col gap-1.5">
              <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
export default LoginClient
