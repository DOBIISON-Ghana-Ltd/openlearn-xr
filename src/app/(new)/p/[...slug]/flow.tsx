'use client';

import React, { useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { LogOut, Flame } from 'lucide-react';
import OverviewFLow from './flow.overview';
import EngageFLow from './flow.engage';
import ExplainFLow from './flow.explain';
import ExploreFLow from './flow.explore';
import CheckpointFLow from './flow.checkpoint';
import ResultFLow from './flow.result';

const TAB_FLOW = [
  { id: 'overview', render: OverviewFLow, backLabel: 'Back', nextLabel: 'Start Learning' },
  { id: 'engage', render: EngageFLow, backLabel: 'Back', nextLabel: 'Check Answer' },
  { id: 'explain', render: ExplainFLow, backLabel: 'Back', nextLabel: 'Next' },
  { id: 'explore', render: ExploreFLow, backLabel: 'Back', nextLabel: 'Next' },
  { id: 'checkpoint', render: CheckpointFLow, backLabel: 'Back', nextLabel: 'Check Answer' },
  { id: 'result', render: ResultFLow, backLabel: 'Retake Lesson', nextLabel: 'Back to Modules' },
];

export default function FLow() {
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = TAB_FLOW[tabIndex];

  const handleNext = () => {
    if (tabIndex < TAB_FLOW.length - 1) {
      setTabIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (tabIndex > 0) {
      setTabIndex((prev) => prev - 1);
    }
  };

  return (
    <Tabs.Root
      value={activeTab.id}
      onValueChange={(val) => {
        const idx = TAB_FLOW.findIndex((t) => t.id === val);
        if (idx !== -1) setTabIndex(idx);
      }}
      className="relative h-dvh min-h-screen flex flex-col bg-white overflow-hidden"
    >
      {/* RED ROW 1: PARENT STICKY TOP NAVBAR (FIGMA NODE 10:58) */}
      <header className="bg-[rgba(248,250,252,0.7)] backdrop-blur-[5px] border-b border-[rgba(156,163,175,0.2)] px-8 lg:px-[80px] flex items-center justify-between shrink-0 h-[73px] z-20">
        {/* Left: Exit Lesson */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2.5 text-[16px] font-normal text-[#111827] hover:text-[#459d9f] transition-colors cursor-pointer"
        >
          <LogOut className="size-5 rotate-180 text-[#111827]" />
          <span>Exit Lesson</span>
        </button>

        {/* Right: Streak & User Profile */}
        <div className="flex items-center gap-6">
          {/* Streak Flame */}
          <div className="flex items-center gap-2 text-[16px] font-normal text-[#111827]">
            <span>5</span>
            <Flame className="size-[26px] text-[#f97316] fill-[#f97316]" />
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-[rgba(156,163,175,0.4)]" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-normal text-[#111827]">
              User Name
            </span>
            <div className="size-[40px] rounded-full bg-[#111827] shrink-0" />
          </div>
        </div>
      </header>

      {/* RED ROW 2: MAIN CONTENT PANEL (FIGMA NODE 10:25) */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {TAB_FLOW.map((content) => (
          <Tabs.Panel key={content.id} value={content.id} className="flex-1 flex flex-col min-h-0">
            <content.render />
          </Tabs.Panel>
        ))}
      </main>

      {/* RED ROW 3: PARENT STICKY BOTTOM BUTTON BAR (FIGMA NODE 78:65) */}
      <footer className="bg-[#f2fafa] px-8 lg:px-[87px] flex justify-between items-center z-20 shrink-0 h-[92px]">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          disabled={tabIndex === 0}
          className={`bg-[#f8fafc] text-[#6b7280] text-[18px] font-semibold w-[239px] h-[60px] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex items-center justify-center transition-all cursor-pointer ${tabIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'active:scale-98 hover:bg-white'
            }`}
        >
          {activeTab.backLabel}
        </button>

        {/* Start Learning / Primary Action Button */}
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#459d9f] text-[#f8fafc] text-[18px] font-semibold w-[239px] h-[60px] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] flex items-center justify-center hover:bg-[#3b8789] transition-all cursor-pointer active:scale-98"
        >
          {activeTab.nextLabel}
        </button>
      </footer>
    </Tabs.Root>
  );
}