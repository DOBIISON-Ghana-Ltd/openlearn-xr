'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Header from '@/components/(new)/common/header';

const INITIAL_STUDENTS = [
  { id: 's1', name: 'Sarah Adjei', status: 'Ready' },
  { id: 's2', name: 'John Mensah', status: 'Ready' },
  { id: 's3', name: 'Kwame Boateng', status: 'Ready' },
  { id: 's4', name: 'Ama Otari', status: 'Ready' },
];

export default function SessionWaitingRoomClient() {
  const [students] = useState(INITIAL_STUDENTS);
  const [sessionCode] = useState('ABX472');
  const [moduleTitle] = useState('Atomic Structure');
  const [maxStudents] = useState(20);

  const handleStartSession = () => {
    alert('Starting session...');
  };

  return (
    <>
      <Header />
      <div className="relative min-h-[calc(100dvh-101px)] flex flex-col bg-[#f8fafc]">
        {/* RED ROW 1: TOP HEADER BAR */}
        <div className="bg-[#f8fafc] px-8 py-3.5 flex items-center justify-between shrink-0 h-[47px]">
          <h1 className="text-[24px] font-semibold text-[#4b5563]">
            Waiting Room
          </h1>
        </div>

        {/* RED ROW 2: MAIN CONTENT TAKING FLEX-1 WITH WHITE BACKGROUND */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-0 bg-white overflow-y-auto">
          {/* Main Card Container */}
          <div className="w-full max-w-[827px] bg-[#f2fafa] rounded-[20px] p-8 lg:p-10 flex flex-col gap-6 shadow-xs">
            {/* Header Stats Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              {/* Title & Code Badge */}
              <div className="flex items-center gap-3">
                <h2 className="text-[32px] font-semibold text-[#111827]">
                  {moduleTitle}
                </h2>
                <span className="bg-[#ddf3f3] border border-[#459d9f]/20 text-[#4b5563] text-[12px] font-light px-3 py-1 rounded-[5px]">
                  {sessionCode}
                </span>
              </div>

              {/* Joined & Max Badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-[#ddf3f3] border border-[#459d9f]/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
                  <span className="text-[20px] font-semibold text-[#22c55e] leading-none mb-1">
                    {students.length}
                  </span>
                  <span className="text-[14px] font-semibold text-[#4b5563] leading-none">
                    Joined
                  </span>
                </div>
                <div className="bg-[#ddf3f3] border border-[#459d9f]/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
                  <span className="text-[20px] font-semibold text-[#4b5563] leading-none mb-1">
                    {maxStudents}
                  </span>
                  <span className="text-[14px] font-semibold text-[#4b5563] leading-none">
                    Max
                  </span>
                </div>
              </div>
            </div>

            {/* Student List Container */}
            <div className="flex flex-col w-full gap-2">
              {/* Sub-Header Row */}
              <div className="border-b border-[#459d9f]/20 pb-3 flex items-center justify-between px-3">
                <span className="text-[12px] font-light text-[#6b7280]">
                  Students
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[12px] font-light text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer"
                >
                  <span>Sort: A-Z</span>
                  <ChevronDown className="size-3.5 text-[#64748b]" />
                </button>
              </div>

              {/* Student Rows Stack */}
              <div className="flex flex-col gap-2 pt-1">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 rounded-[4px] hover:bg-black/5 transition-colors"
                  >
                    {/* Left: Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#334155] shrink-0" />
                      <span className="text-[14px] font-normal text-[#6b7280]">
                        {st.name}
                      </span>
                    </div>

                    {/* Right: Status Dot + Label */}
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#4ade80]" />
                      <span className="text-[10px] font-normal text-[#4ade80]">
                        {st.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RED ROW 3: STICKY BOTTOM CONTROL BAR */}
        <div className="sticky bottom-0 bg-[#f8fafc] py-3.5 px-8 flex justify-end items-center z-10 shrink-0 h-[58px]">
          <button
            type="button"
            onClick={handleStartSession}
            className="bg-[#459d9f] hover:bg-[#3b8789] text-[#f8fafc] text-[18px] font-semibold px-8 py-2.5 rounded-[10px] shadow-sm transition-all cursor-pointer active:scale-98"
          >
            Start Session
          </button>
        </div>
      </div>
    </>
  );
}
