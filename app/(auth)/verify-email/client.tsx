'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authClient } from '@/adapters/auth/client'
import { Spinner } from '@/components/ui/spinner'

export function VerifyEmailClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMsg('Verification token is missing.')
      return
    }

    const verify = async () => {
      try {
        await authClient.verifyEmail({
          token,
          fetchOptions: {
            onError: (ctx) => {
              setStatus('error')
              setErrorMsg(ctx.error.message || 'Verification failed. The token may be expired or invalid.')
            },
            onSuccess: () => {
              setStatus('success')
            },
          },
        })
      } catch (err) {
        setStatus('error')
        setErrorMsg('An unexpected error occurred during verification.')
      }
    }

    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Verifying your email</CardTitle>
          <CardDescription>
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>
            {errorMsg}
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
        <CardTitle>Email Verified!</CardTitle>
        <CardDescription>
          Your email address has been successfully verified. You can now sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center border-t border-border pt-4">
        <Button onClick={() => router.push('/login')} className="w-full">
          Sign In
        </Button>
      </CardFooter>
    </Card>
  )
}
export default VerifyEmailClient
