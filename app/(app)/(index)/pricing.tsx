import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function Pricing() {
  const tiers = [
    {
      name: 'Solo Teacher',
      price: '$4.99',
      period: '/ mo',
      description: 'Approx. 75 GHS. Best for individual teachers purchasing out of pocket to assess their personal classrooms.',
      features: [
        '1 Host/Teacher Seat',
        'Up to 3 active concurrent sessions',
        'Real-time student checkpoint tracking',
        'Session-specific leaderboards'
      ],
      buttonLabel: 'Get Started',
      href: '/register',
      highlighted: false
    },
    {
      name: 'Department Workspace',
      price: '$19.99',
      period: '/ mo',
      description: 'Approx. 300 GHS. Best for small subject teams (e.g., Chemistry Department) drawing directly from school department funds.',
      features: [
        'Up to 10 Host/Teacher Seats',
        'Shared Organization Dashboard',
        'Unlimited concurrent sessions',
        'Shared session logs and histories'
      ],
      buttonLabel: 'Upgrade to Department',
      href: '/register?tier=department',
      highlighted: true
    },
    {
      name: 'Institutions',
      price: 'Custom',
      period: 'Invoice',
      description: 'Best for private school chains, school buildings, or Ministry of Education integrations.',
      features: [
        'Unlimited Host/Teacher Seats',
        'Wildcard email domain matching',
        'Custom logo branding on student view',
        'Priority integration & setup support'
      ],
      buttonLabel: 'Contact Sales',
      href: '/contact',
      highlighted: false
    }
  ]

  return (
    <section className="relative py-24 bg-muted/50 overflow-hidden">
      {/* Decorative gradient background for glassmorphism effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing Tiers for Classrooms and Institutions</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Empower your teaching staff with real-time analytics, session code distribution, and performance tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative flex flex-col backdrop-blur-xl bg-background/60 border ${tier.highlighted ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'border-border/50'}`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="text-muted-foreground font-medium">{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground pt-2 h-16">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4 pt-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button render={<Link href={tier.href} />} size="lg" variant={tier.highlighted ? 'default' : 'outline'} className="w-full rounded-full">
                  {tier.buttonLabel}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block backdrop-blur-md bg-background/40 border border-border/50 rounded-2xl p-8 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-2">Private Server Customization</h3>
            <p className="text-muted-foreground mb-6">
              Move off our hosted service. Contact us to configure your own local models and host the application on private school servers.
            </p>
            <Button render={<Link href="/contact" />} variant="secondary" className="rounded-full">
              Learn About Self-Hosting
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
