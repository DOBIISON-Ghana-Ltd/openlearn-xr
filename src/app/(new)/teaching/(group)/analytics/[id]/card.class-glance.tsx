'use client';

import { Infer } from '@/data/types.base';
import { cn } from '@/lib/utils/cn';
import { ArrowUp, Minus, ArrowDown } from 'lucide-react';

export type IClassGlanceCard = Partial<Infer["SesAnalyticsGetMetrics"]["res"]>;

export default function ClassGlanceCard(props: IClassGlanceCard) {
  const {
    improvedCount = 0,
    improvedPercent = 0,
    noChangeCount = 0,
    noChangePercent = 0,
    declinedCount = 0,
    declinedPercent = 0,
  } = props;

  return (
    <div className="col-span-12 lg:col-span-4 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-h6 sm:text-h5 font-bold text-secondary-text">
          Your class learning at a glance.
        </h2>
      </div>

      {/* Breakdown Rows */}
      <div className="flex flex-col gap-3.5">
        <Card type="improvement" count={improvedCount} percent={improvedPercent} />
        <Card type="no-change" count={noChangeCount} percent={noChangePercent} />
        <Card type="declined" count={declinedCount} percent={declinedPercent} />
      </div>
    </div>
  );
}

type ICard = {
  type: "improvement" | "declined" | "no-change";
  count: number;
  percent: number;
};

function Card(props: ICard) {
  const { type, count, percent } = props;

  const options = {
    "improvement": { icon: ArrowUp, label: "Improved", color: "text-success", borderColor: "border-success" },
    "no-change": { icon: Minus, label: "Little / No Change", color: "text-secondary-text", borderColor: "border-secondary-text/50" },
    "declined": { icon: ArrowDown, label: "Declined", color: "text-warning", borderColor: "border-warning" },
  };

  const activeOption = options[type];

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-surface-white/90 border border-surface-white rounded-2xl shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className={cn("size-9 sm:size-10 rounded-full border-2 flex-center shrink-0", activeOption.color, activeOption.borderColor)}>
          <activeOption.icon className="size-4.5 sm:size-5 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className={cn("text-h6 font-bold leading-tight", activeOption.color)}>
            {count}
          </span>
          <span className="text-caption text-tertiary leading-tight">
            {activeOption.label}
          </span>
        </div>
      </div>
      <span className="text-h6 sm:text-h5 font-bold text-secondary-text">
        {percent}%
      </span>
    </div>
  );
}