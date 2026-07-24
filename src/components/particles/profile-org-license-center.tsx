"use client";

import useApi from "@/data/hooks/use-api";
import { LICENSE_TIERS, TierKey } from "@/lib/constants/licensing";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/cn";
import { CheckIcon, CrownIcon, CreditCardIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function ProfileOrgLicenseCenter() {
  const { data: activeOrg } = useApi.query("app:org:get:active");
  const { data: subscription, isLoading } = useApi.query(
    "app:org:get:subscription",
    activeOrg?.id,
    !!activeOrg?.id
  );

  if (isLoading) {
    return (
      <div className="flex flex-col w-full px-4 py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Active status color mapping
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "TRIALING":
        return "success";
      case "PAST_DUE":
        return "warning";
      case "CANCELED":
      default:
        return "destructive";
    }
  };

  // Find active plan details
  const activeTierKey = (activeOrg?.subscriptionTier || "FREE") as TierKey;
  const activePlanDetails = LICENSE_TIERS.find((t) => t.key === activeTierKey);

  // Format renewal date
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "N/A";

  return (
    <div className="flex flex-col w-full px-4 py-6 space-y-8 pb-12">
      <div>
        <h4 className="text-xl font-normal text-foreground">Licensing</h4>
        <p className="text-sm text-muted-foreground">Manage your organization's subscription, seats, and billing settings.</p>
      </div>

      {/* Active Subscription Overview Card */}
      {subscription && (
        <div className="relative overflow-hidden rounded-xl border border-border bg-popover/40 backdrop-blur-md p-6 shadow-xs/5">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/8 text-primary rounded-lg">
                <CrownIcon strokeWidth={1.5} className="size-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-semibold text-lg">{activePlanDetails?.name || "Free"} Plan</h5>
                  <Badge variant={getStatusVariant(subscription.status)} className="capitalize text-xs px-2 h-5 rounded-full font-medium">
                    {subscription.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs-m text-muted-foreground">
                  {activePlanDetails?.tagline || "Play published XR modules."}
                </p>
                {activeTierKey !== "FREE" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CreditCardIcon className="size-3.5" />
                    Next billing date: <span className="font-medium text-foreground">{renewalDate}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-1 border-t md:border-t-0 pt-4 md:pt-0 border-border">
              <p className="text-xs text-muted-foreground">Allocated Capacity</p>
              <p className="font-semibold text-lg text-foreground">
                {subscription.isUnlimited ? "Unlimited seats" : `${subscription.seats} collaborative seat${subscription.seats > 1 ? "s" : ""}`}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {activeTierKey === "FREE" || activeTierKey === "PRO" ? "Member invites disabled" : "Invite members in the Members tab"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans Grid */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h5 className="font-semibold text-base">Subscription Plans</h5>
          <p className="text-xs-m text-muted-foreground">Explore feature sets, concurrent hosting, and connection quotas across plans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LICENSE_TIERS.map((tier) => {
            const isActive = tier.key === activeTierKey;

            return (
              <div
                key={tier.key}
                className={cn(
                  "relative flex flex-col justify-between rounded-xl border p-6 bg-card transition-all duration-200",
                  {
                    "border-primary shadow-sm ring-1 ring-primary/20 scale-[1.01]": tier.highlighted,
                    "border-border hover:border-muted-foreground/32": !tier.highlighted && !isActive,
                    "border-primary/48 bg-primary/4": isActive && !tier.highlighted,
                  }
                )}
              >
                {tier.highlighted && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary px-3 py-0.5 rounded-full text-[10px] font-semibold text-primary-foreground tracking-wide uppercase">
                    Recommended
                  </span>
                )}

                {isActive && (
                  <span className="absolute top-0 left-6 -translate-y-1/2 bg-foreground text-background px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">
                    Current Plan
                  </span>
                )}

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h6 className="font-semibold text-base text-foreground">{tier.name}</h6>
                    <p className="text-xs text-muted-foreground leading-normal min-h-8">{tier.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-1 border-b border-border/60">
                    <span className="text-2xl font-bold tracking-tight text-foreground">{tier.price}</span>
                    <span className="text-xs text-muted-foreground font-medium">{tier.priceSub && `/ ${tier.priceSub}`}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs-m text-muted-foreground">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckIcon className="size-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40 w-full">
                  {isActive ? (
                    <Button className="w-full" variant="outline" disabled>
                      Active Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                      render={<a href={tier.ctaHref} />}
                    >
                      {tier.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}