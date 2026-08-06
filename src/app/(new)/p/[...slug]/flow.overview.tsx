'use client';

import { Clock } from 'lucide-react';

export default function OverviewFLow() {
  return (
    <div className="flex-1 bg-[#f2fafa] pt-5 pb-8 px-8 lg:pl-[238px] lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-[657px] flex flex-col items-start gap-5">
        {/* Subject & Year Badge (Figma Node 10:28: w-[260px] h-[50px] left-[238px] top-[85px]) */}
        <div className="bg-[rgba(242,250,250,0.8)] border border-[#ddf3f3] rounded-[15px] h-[50px] w-[260px] px-5 flex items-center justify-between">
          <span className="text-[20px] font-semibold text-[#459d9f]">
            Chemistry
          </span>
          <span className="size-[10px] rounded-full bg-[#459d9f]" />
          <span className="text-[20px] font-semibold text-[#6b7280]">
            Year 1
          </span>
        </div>

        {/* Module Title (Figma Node 10:46: 48px bold #459d9f) */}
        <h1 className="text-[48px] font-bold text-[#459d9f] leading-tight">
          Atomic Structure
        </h1>

        {/* Module Description (Figma Node 10:47: 16px text-[#111827]) */}
        <p className="text-[16px] font-normal text-[#111827] leading-normal w-full max-w-[656px]">
          Discover what makes up every atom and how protons, neutrons and electrons are arranged.
        </p>

        {/* Metadata Pills Row (Figma Nodes 10:32, 10:39, 10:43: h-[35px]) */}
        <div className="flex items-center gap-3">
          {/* Duration Pill */}
          <div className="bg-[rgba(242,250,250,0.7)] border border-[#ddf3f3] rounded-[10px] h-[35px] px-3 flex items-center justify-center gap-2">
            <Clock className="size-5 text-[#4b5563]" />
            <span className="text-[16px] font-normal text-[#4b5563]">
              20 mins
            </span>
          </div>

          {/* Difficulty Pill */}
          <div className="bg-[rgba(242,250,250,0.7)] border border-[#ddf3f3] rounded-[10px] h-[35px] px-3 flex items-center justify-center gap-2">
            <span className="size-[10px] rounded-full bg-[#f59e0b]" />
            <span className="text-[16px] font-normal text-[#4b5563]">
              Medium
            </span>
          </div>

          {/* Progress Pill */}
          <div className="bg-[rgba(242,250,250,0.7)] border border-[#ddf3f3] rounded-[10px] h-[35px] px-3 flex items-center justify-center">
            <span className="text-[16px] font-normal text-[#4b5563]">
              0% Progress
            </span>
          </div>
        </div>

        {/* Learning Objectives Box (Figma Node 10:48: w-[657px] min-h-[225px]) */}
        <div className="w-full bg-[rgba(248,250,252,0.8)] border border-[rgba(156,163,175,0.3)] rounded-[10px] p-8 flex flex-col gap-4 mt-2">
          <h2 className="text-[18px] font-normal text-[#111827]">
            Learning objectives
          </h2>
          <p className="text-[16px] font-normal text-[#4b5563]">
            By the end of these activities, you should be able to:
          </p>

          <ul className="list-disc pl-6 flex flex-col gap-2.5 text-[14px] font-normal text-[#4b5563]">
            <li>Identify the three subatomic particles</li>
            <li>Describe where they are located</li>
            <li>Explain how atomic number differs from mass number</li>
          </ul>
        </div>
      </div>
    </div>
  );
}