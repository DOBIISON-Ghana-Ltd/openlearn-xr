'use client';

import { ArrowUp, Minus, ArrowDown } from 'lucide-react';

export type IClassGlanceCard = {
  id?: string;
  improvedCount?: number;
  improvedPercent?: number;
  noChangeCount?: number;
  noChangePercent?: number;
  declinedCount?: number;
  declinedPercent?: number;
};

export default function ClassGlanceCard(props: IClassGlanceCard) {
  const {
    improvedCount = 16,
    improvedPercent = 80,
    noChangeCount = 3,
    noChangePercent = 15,
    declinedCount = 1,
    declinedPercent = 5,
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
        {/* Improved */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-surface-white/90 border border-surface-white rounded-2xl shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="size-9 sm:size-10 rounded-full border-2 border-success flex items-center justify-center text-success shrink-0">
              <ArrowUp className="size-4.5 sm:size-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-h6 font-bold text-success leading-tight">
                {improvedCount}
              </span>
              <span className="text-caption text-tertiary leading-tight">
                Improved
              </span>
            </div>
          </div>
          <span className="text-h6 sm:text-h5 font-bold text-secondary-text">
            {improvedPercent}%
          </span>
        </div>

        {/* Little / No Change */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-surface-white/90 border border-surface-white rounded-2xl shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="size-9 sm:size-10 rounded-full border-2 border-secondary-text/50 flex items-center justify-center text-secondary-text shrink-0">
              <Minus className="size-4.5 sm:size-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-h6 font-bold text-secondary-text leading-tight">
                {noChangeCount}
              </span>
              <span className="text-caption text-tertiary leading-tight">
                Little / No Change
              </span>
            </div>
          </div>
          <span className="text-h6 sm:text-h5 font-bold text-secondary-text">
            {noChangePercent}%
          </span>
        </div>

        {/* Declined */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-surface-white/90 border border-warning/60 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="size-9 sm:size-10 rounded-full border-2 border-warning flex items-center justify-center text-warning shrink-0">
              <ArrowDown className="size-4.5 sm:size-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-h6 font-bold text-warning leading-tight">
                {declinedCount}
              </span>
              <span className="text-caption text-tertiary leading-tight">
                Declined
              </span>
            </div>
          </div>
          <span className="text-h6 sm:text-h5 font-bold text-secondary-text">
            {declinedPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
