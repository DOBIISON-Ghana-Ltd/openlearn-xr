"use client";

import { LockIcon } from "lucide-react";
import SectionWrapper from "./section.wrapper";

export default function SettingsSection() {
  return (
    <SectionWrapper icon={LockIcon} title="Account Settings" desc="Manage your account security.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-small font-bold text-primary-text-dark leading-snug">
            Change Password
          </h4>
          <p className="text-caption text-secondary-text font-normal">
            Update your password to keep your account secure.
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-primary-light text-primary-cta hover:bg-primary-light/80 font-semibold text-caption transition-colors self-start sm:self-auto"
        >
          Change Password
        </button>
      </div>
    </SectionWrapper>
  )
}