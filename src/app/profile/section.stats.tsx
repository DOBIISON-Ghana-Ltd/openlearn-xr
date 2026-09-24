"use client";

import { BookOpenIcon, FlameIcon, TargetIcon, TrendingUpIcon, TrophyIcon } from "lucide-react";
import useApi from "@/data/hooks/use-api";

export default function StatsSection() {
  const { data: statsData } = useApi.query("app:user:get:profile-stats");

  const stats = [
    {
      label: "Modules Completed",
      sub: "Sessions",
      value: String(statsData?.modulesCompleted ?? 18),
      icon: BookOpenIcon,
    },
    {
      label: "Average Score",
      sub: "Across all sessions",
      value: String(statsData?.averageScore ?? 100),
      icon: TrendingUpIcon,
    },
    {
      label: "Best Score",
      sub: statsData?.bestScoreTopic ?? "Atomic Structure",
      value: String(statsData?.bestScore ?? 200),
      icon: TargetIcon,
    },
    {
      label: "Current Streak",
      sub: "Days",
      value: String(statsData?.currentStreak ?? 0),
      icon: FlameIcon,
    },
    {
      label: "Badges Earned",
      sub: "Badges",
      value: String(statsData?.badgesEarned ?? 0),
      icon: TrophyIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="relative overflow-hidden rounded-2xl bg-primary-subtle border border-primary-light p-4.5 flex flex-col justify-between h-28 shadow-xs">
          <div>
            <span className="block text-micro font-bold text-tertiary uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-h5 sm:text-h4 font-bold text-primary-text-dark leading-tight">
              {stat.value}
            </span>
          </div>
          <span className="text-caption text-tertiary font-medium">{stat.sub}</span>

          {/* Watermark Book Icon */}
          <stat.icon className="absolute -right-2 -bottom-2 size-20 text-primary-cta opacity-15 pointer-events-none stroke-current" />
        </div>
      ))}
    </div>
  )
}