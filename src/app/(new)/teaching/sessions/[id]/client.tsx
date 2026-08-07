'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
      <div className="relative min-h-[calc(100dvh-101px)] flex flex-col bg-surface-slate">
        {/* RED ROW 1: TOP HEADER BAR */}
        <div className="bg-surface-slate px-8 py-3.5 flex items-center justify-between shrink-0 h-[47px]">
          <h1 className="text-h5 text-secondary-text">
            Waiting Room
          </h1>
        </div>

        {/* RED ROW 2: MAIN CONTENT TAKING FLEX-1 WITH WHITE BACKGROUND */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-0 bg-surface-white overflow-y-auto">
          {/* Main Card Container */}
          <div className="w-full max-w-[827px] bg-primary-subtle rounded-[20px] p-8 lg:p-10 flex flex-col gap-6 shadow-xs">
            {/* Header Stats Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              {/* Title & Code Badge */}
              <div className="flex items-center gap-3">
                <h2 className="text-h4 text-primary-text-dark">
                  {moduleTitle}
                </h2>
                <span className="bg-primary-light border border-primary-cta/20 text-secondary-text text-caption px-3 py-1 rounded-[5px]">
                  {sessionCode}
                </span>
              </div>

              {/* Joined & Max Badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-primary-light border border-primary-cta/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
                  <span className="text-h6 text-success leading-none mb-1">
                    {students.length}
                  </span>
                  <span className="text-small font-semibold text-secondary-text leading-none">
                    Joined
                  </span>
                </div>
                <div className="bg-primary-light border border-primary-cta/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
                  <span className="text-h6 text-secondary-text leading-none mb-1">
                    {maxStudents}
                  </span>
                  <span className="text-small font-semibold text-secondary-text leading-none">
                    Max
                  </span>
                </div>
              </div>
            </div>

            {/* Student List Container */}
            <div className="flex flex-col w-full gap-2">
              {/* Sub-Header Row */}
              <div className="border-b border-primary-cta/20 pb-3 flex items-center justify-between px-3">
                <span className="text-caption text-tertiary">
                  Students
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-caption text-tertiary hover:text-primary-text-dark transition-colors cursor-pointer"
                >
                  <span>Sort: A-Z</span>
                  <ChevronDown className="size-3.5 text-tertiary" />
                </button>
              </div>

              {/* Student Rows Stack */}
              <div className="flex flex-col gap-2 pt-1">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 rounded-[4px] hover:bg-primary-light/40 transition-colors"
                  >
                    {/* Left: Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-dark-card shrink-0" />
                      <span className="text-small text-tertiary">
                        {st.name}
                      </span>
                    </div>

                    {/* Right: Status Dot + Label */}
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-status-online" />
                      <span className="text-micro text-status-online">
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
        <div className="sticky bottom-0 bg-surface-slate py-3.5 px-8 flex justify-end items-center z-10 shrink-0 h-[58px]">
          <button
            type="button"
            onClick={handleStartSession}
            className="bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button px-8 py-2.5 rounded-[10px] shadow-sm transition-all cursor-pointer active:scale-98"
          >
            Start Session
          </button>
        </div>
      </div>
    </>
  );
}
