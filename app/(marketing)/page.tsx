'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { BeakerIcon, UsersIcon, TrophyIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-radial from-emerald-50/40 via-transparent to-transparent py-20 lg:py-32 dark:from-emerald-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
            >
              <SparklesIcon className="size-3.5" />
              Revolutionizing Science Education
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-3xl leading-tight"
            >
              Interactive <span className="text-primary">3D Science Labs</span> right in your browser
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl"
            >
              Conduct physics, chemistry, and biology experiments safely, repeatedly, and without expensive laboratory equipment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/register">
                <Button size="xl" className="shadow-lg">
                  Get Started for Free
                  <ArrowRightIcon className="size-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline">
                  Live Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful tools for immersive learning
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to experience, host, and grade virtual laboratory simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-border bg-background p-8 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <BeakerIcon className="size-6" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-foreground">3D Lab Simulations</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Interact with highly detailed 3D apparatus, chemicals, and biology models. Safe, repeatable, and engaging.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-border bg-background p-8 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <UsersIcon className="size-6" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-foreground">Hosted Live Sessions</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Teachers can create classrooms and host live, competitive lab sessions. Students join with a simple code.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-border bg-background p-8 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <TrophyIcon className="size-6" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-foreground">Interactive Checkpoints</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Answer checkpoint questions built directly into the lab steps. Earn concept badges and track scores on a live leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Getting started with OpenLearn is quick and easy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg font-bold dark:bg-emerald-950 dark:text-emerald-400">
                1
              </span>
              <h3 className="mt-6 font-bold text-lg text-foreground">Create an Account</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Sign up as a student or a teacher to configure your workspace in seconds.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg font-bold dark:bg-emerald-950 dark:text-emerald-400">
                2
              </span>
              <h3 className="mt-6 font-bold text-lg text-foreground">Select a Science Module</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Explore our catalog of physics, chemistry, and biology labs designed for curriculum alignment.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg font-bold dark:bg-emerald-950 dark:text-emerald-400">
                3
              </span>
              <h3 className="mt-6 font-bold text-lg text-foreground">Play and Assess</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Interact with the 3D lab environment, complete checkpoints, and download grading reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 dark:bg-emerald-950 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl max-w-3xl mx-auto leading-tight">
            Ready to experience next-generation science labs?
          </h2>
          <p className="mt-4 text-emerald-100 max-w-xl mx-auto">
            Get instant access to interactive modules. No credit card required.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/register">
              <Button size="xl" className="bg-white border-white text-emerald-900 hover:bg-emerald-50">
                Get Started Now
                <ArrowRightIcon className="size-5 text-emerald-900" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
