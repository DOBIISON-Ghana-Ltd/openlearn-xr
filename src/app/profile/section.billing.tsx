"use client";

import { CreditCardIcon } from "lucide-react";
import SectionWrapper from "./section.wrapper";
import useApi from "@/data/hooks/use-api";

export default function BillingSection() {
  const { data: subscription } = useApi.query("app:user:get:profile-subscription");

  return (
    <SectionWrapper icon={CreditCardIcon} title="Billing & Subscription" desc="View your plan and billing details.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
          <div>
            <span className="block text-caption font-medium text-tertiary">
              Current Plan
            </span>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-success/15 border border-success/30 text-success text-caption font-semibold">
              {subscription?.currentPlan ?? "Free Plan"}
            </span>
          </div>

          <div>
            <span className="block text-caption font-medium text-tertiary">
              Account Type
            </span>
            <span className="block mt-1 text-small font-bold text-primary-text-dark">
              {subscription?.accountType ?? "Learner"}
            </span>
          </div>

          <div>
            <span className="block text-caption font-medium text-tertiary">
              Member Since
            </span>
            <span className="block mt-1 text-small font-bold text-primary-text-dark">
              {subscription?.memberSince ?? "Jan 20, 2024"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="px-5 py-2.5 rounded-xl bg-primary-cta text-primary-text-light hover:bg-primary-hover font-semibold text-small shadow-xs transition-colors self-start sm:self-auto"
        >
          Upgrade Plan
        </button>
      </div>
    </SectionWrapper>
  )
}