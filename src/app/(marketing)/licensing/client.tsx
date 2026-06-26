"use client";

import Link from "next/link";
import { Check, X, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";
import {
  LICENSE_TIERS,
  COMPARISON_ROWS,
  LICENSE_FAQ,
  type LicenseTier,
  type TierKey,
} from "@/lib/constants/licensing";
import { cn } from "@/lib/utils/cn";

// Literal hrefs — these routes are defined in routes.ts as string constants
const REGISTER_HREF = "/register";
const CONTACT_HREF = "/contact";

// ============================================================================
// HELPERS
// ============================================================================

function CellValue({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="size-4 text-emerald-500 mx-auto" />;
  if (value === false)
    return <X className="size-4 text-muted-foreground/40 mx-auto" />;
  return (
    <span className="text-xs text-foreground/80 font-medium">{value}</span>
  );
}

// ============================================================================
// TIER CARD
// ============================================================================

function TierCard({ tier }: { tier: LicenseTier }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-shadow",
        tier.highlighted
          ? "border-emerald-500 bg-emerald-950/5 shadow-xl shadow-emerald-500/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
          : "border-border bg-card hover:shadow-md"
      )}
    >
      {/* Most Popular Badge */}
      {tier.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
            <Sparkles className="size-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Tier Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-widest",
              tier.highlighted ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            {tier.key}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{tier.tagline}</p>
      </div>

      {/* Audience Badge */}
      <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-5 self-start">
        {tier.audience}
      </div>

      {/* Price */}
      <div className="mb-5">
        <span className="text-3xl font-extrabold text-foreground">
          {tier.price}
        </span>
        {tier.price !== "Custom" && tier.price !== "Contact Us" && (
          <span className="ml-1 text-sm text-muted-foreground">
            / {tier.priceSub}
          </span>
        )}
        {(tier.price === "Custom" || tier.price === "Contact Us") && (
          <p className="text-xs text-muted-foreground mt-0.5">{tier.priceSub}</p>
        )}
      </div>

      {/* CTA */}
      <Button
        render={<Link href={tier.ctaHref} />}
        className={cn(
          "w-full mb-6",
          tier.highlighted
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : ""
        )}
        variant={tier.highlighted ? "default" : "outline"}
      >
        {tier.cta}
        <ArrowRight className="size-3.5 ml-1" />
      </Button>

      {/* Feature List */}
      <ul className="space-y-2.5 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// MAIN CLIENT PAGE
// ============================================================================

export default function LicensingClient() {
  const tierKeys: TierKey[] = ["FREE", "PRO", "DEPARTMENT", "ENTERPRISE", "UNLIMITED"];

  return (
    <div className="min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: HERO                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b border-border/50 pb-20 pt-24">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--color-emerald-500)/0.12),transparent)]" />

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
            <Zap className="size-3" />
            Simple, Transparent Pricing
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            The right plan for{" "}
            <span className="text-emerald-500">every learner</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            From individual students exploring XR science simulations to entire
            institutions deploying immersive learning at scale — OpenLearn XR
            has a plan built for you.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href={REGISTER_HREF} />}
              className="h-11 px-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Start Free
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
            <Button
              render={<Link href={CONTACT_HREF} />}
              variant="outline"
              className="h-11 px-7 rounded-full"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: PRICING CARDS                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {LICENSE_TIERS.map((tier) => (
              <TierCard key={tier.key} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: FEATURE COMPARISON TABLE                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Compare all features
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A full breakdown of what each plan includes so you can make an
              informed decision.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-sidebar">
                  <th className="py-4 px-5 text-left font-semibold text-foreground w-48">
                    Feature
                  </th>
                  {tierKeys.map((key) => {
                    const tier = LICENSE_TIERS.find((t) => t.key === key)!;
                    return (
                      <th
                        key={key}
                        className={cn(
                          "py-4 px-4 text-center font-semibold",
                          key === "PRO"
                            ? "text-emerald-500"
                            : "text-foreground"
                        )}
                      >
                        {tier.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-border/50 last:border-0",
                      i % 2 === 0 ? "bg-background" : "bg-sidebar/30"
                    )}
                  >
                    <td className="py-3.5 px-5 font-medium text-foreground/80">
                      {row.feature}
                    </td>
                    {tierKeys.map((key) => (
                      <td
                        key={key}
                        className={cn(
                          "py-3.5 px-4 text-center",
                          key === "PRO" ? "bg-emerald-500/5" : ""
                        )}
                      >
                        <CellValue value={row[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4: FAQ                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Still have questions?{" "}
              <Link
                href={CONTACT_HREF}
                className="text-emerald-500 hover:underline font-medium"
              >
                Reach out to our team →
              </Link>
            </p>
          </div>

          <Accordion>
            {LICENSE_FAQ.map((item, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger className="text-base font-medium text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionPanel>{item.answer}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5: FINAL CTA BANNER                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-16 text-center shadow-2xl">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to bring XR learning to your institution?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-emerald-100">
                Join thousands of educators using OpenLearn XR to run
                immersive, interactive science simulations at any scale.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  render={<Link href={REGISTER_HREF} />}
                  className="h-11 px-8 rounded-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
                >
                  Start Free
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
                <Button
                  render={<Link href={CONTACT_HREF} />}
                  variant="outline"
                  className="h-11 px-8 rounded-full border-white/40 text-white hover:bg-white/10 hover:text-white"
                >
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
