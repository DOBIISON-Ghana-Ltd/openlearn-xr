"use client";

import { useState } from "react";
import DeleteSection from "./section.delete";
import SettingsSection from "./section.settings";
import OverviewSection from "./section.overview";
import StatsSection from "./section.stats";
import BillingSection from "./section.billing";
import ActivitySection from "./section.activity";

export default function ClientPage() {

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-h5 text-primary-text-dark tracking-tight">
          My Profile
        </h1>
      </div>
      <OverviewSection />
      <StatsSection />
      <SettingsSection />
      <BillingSection />
      <ActivitySection />
      <DeleteSection />
    </main>
  );
}