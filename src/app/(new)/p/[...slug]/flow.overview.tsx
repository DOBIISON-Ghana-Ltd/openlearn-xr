'use client';

import { Clock } from 'lucide-react';

export default function OverviewFLow() {
  return (
    <div className="flex-1 bg-primary-subtle pt-5 pb-8 px-8 lg:pl-[238px] lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-[657px] flex flex-col items-start gap-5">
        {/* Subject & Year Badge (Figma Node 10:28: w-[260px] h-[50px] left-[238px] top-[85px]) */}
        <div className="bg-primary-subtle/80 border border-primary-light rounded-[15px] h-[50px] w-[260px] px-5 flex items-center justify-between">
          <span className="text-h6 text-primary-cta">
            Chemistry
          </span>
          <span className="size-[10px] rounded-full bg-primary-cta" />
          <span className="text-h6 text-tertiary">
            Year 1
          </span>
        </div>

        {/* Module Title (Figma Node 10:46: 48px bold #459d9f) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          Atomic Structure
        </h1>

        {/* Module Description (Figma Node 10:47: 16px text-[#111827]) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-[656px]">
          Discover what makes up every atom and how protons, neutrons and electrons are arranged.
        </p>

        {/* Metadata Pills Row (Figma Nodes 10:32, 10:39, 10:43: h-[35px]) */}
        <div className="flex items-center gap-3">
          {/* Duration Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-[35px] px-3 flex items-center justify-center gap-2">
            <Clock className="size-5 text-secondary-text" />
            <span className="text-normal text-secondary-text">
              20 mins
            </span>
          </div>

          {/* Difficulty Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-[35px] px-3 flex items-center justify-center gap-2">
            <span className="size-[10px] rounded-full bg-warning" />
            <span className="text-normal text-secondary-text">
              Medium
            </span>
          </div>

          {/* Progress Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-[35px] px-3 flex items-center justify-center">
            <span className="text-normal text-secondary-text">
              0% Progress
            </span>
          </div>
        </div>

        {/* Learning Objectives Box (Figma Node 10:48: w-[657px] min-h-[225px]) */}
        <div className="w-full bg-surface-slate/80 border border-disable/30 rounded-[10px] p-8 flex flex-col gap-4 mt-2">
          <h2 className="text-large text-primary-text-dark">
            Learning objectives
          </h2>
          <p className="text-normal text-secondary-text">
            By the end of these activities, you should be able to:
          </p>

          <ul className="list-disc pl-6 flex flex-col gap-2.5 text-small text-secondary-text">
            <li>Identify the three subatomic particles</li>
            <li>Describe where they are located</li>
            <li>Explain how atomic number differs from mass number</li>
          </ul>
        </div>
      </div>
    </div>
  );
}