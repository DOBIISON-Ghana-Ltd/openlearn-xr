import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface AuthFormCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function AuthFormCard({ title, description, children }: AuthFormCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
