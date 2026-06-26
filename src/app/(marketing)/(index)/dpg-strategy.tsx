import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function DPGStrategy() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Main DPG Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary border-primary/20 bg-primary/5">
              Open Source
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A Global Digital Public Good (DPG)
            </h2>
            <p className="text-xl font-medium text-foreground/80">
              Open-source software designed to democratize science education globally.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The OpenLearn codebase is completely open-source on GitHub. We believe high-quality educational tools should belong to the public. Schools, universities, and ministries can host their own private cloud instance of OpenLearn for free.
            </p>
            <div className="pt-4">
              <Button render={<Link href="https://github.com/open-learn-xr" target="_blank" rel="noopener noreferrer" />} variant="outline" size="lg" className="rounded-full">
                View Source on GitHub
              </Button>
            </div>
          </div>

          {/* Consulting Upsell */}
          <Card className="bg-primary/5 border-primary/20 shadow-none">
            <CardContent className="p-8 sm:p-10 space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Need your own deployment?</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We help institutions set up their own servers, upload custom school curricula, and connect local, offline AI models to automatically generate personalized labs for their pupils.
              </p>
              <Button render={<Link href="/contact" />} size="lg" className="w-full sm:w-auto mt-4 rounded-full">
                Contact Setup & Integration Team
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
