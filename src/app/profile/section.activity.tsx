"use client";

import { HistoryIcon } from "lucide-react";
import SectionWrapper from "./section.wrapper";
import useApi from "@/data/hooks/use-api";

export default function ActivitySection() {
  const { data: history } = useApi.query("app:user:get:profile-history");

  return (
    <SectionWrapper icon={HistoryIcon} title="Activity & History" desc="View your recent activity and progress.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h4 className="text-small font-bold text-primary-text-dark leading-snug">
            Recent Activity
          </h4>
          <p className="text-caption text-secondary-text font-normal">
            See your latest completed sessions and scores.
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-primary-light text-primary-cta hover:bg-primary-light/80 font-semibold text-caption transition-colors self-start sm:self-auto"
        >
          View Activity
        </button>
      </div>
    </SectionWrapper>
  )
}