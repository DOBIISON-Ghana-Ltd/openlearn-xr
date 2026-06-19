import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_lab_bg.png"
          alt="Advanced 3D Virtual Science Laboratory"
          fill
          className="object-cover opacity-20 dark:opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Interactive Science Labs for{' '}
            <span className="text-primary">Every School in Ghana</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Access free, curriculum-aligned 3D science simulations verified by the Ghana Education Service (GES). Play immediately in your browser—no login required.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button render={<Link href="/library" />} size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25">
              Play Anonymously
            </Button>
            
            <Button render={<Link href="/register" />} variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-background/50 backdrop-blur-md hover:bg-accent">
              Host Live Session
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
