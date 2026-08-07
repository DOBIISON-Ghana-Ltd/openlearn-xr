'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { Tabs } from '@base-ui/react/tabs';
import { Search, Clock, BarChart2, Check, Info, ChevronsUpDown, Copy, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Header from '@/components/(new)/common/header';

const tabFlow = [
  { id: 'select', title: 'Create a Session', step: '1 of 3', render: SelectTabContent },
  { id: 'configure', title: 'Configure Session', step: '2 of 3', render: ConfigureTabContent },
  { id: 'success', title: 'Share Session Code', step: '3 of 3', render: SuccessTabContent },
];

export default function CreateSessionClient() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = tabFlow[tabIndex];

  const handleNext = () => {
    if (tabIndex < tabFlow.length - 1) {
      setTabIndex((prev) => prev + 1);
    } else {
      router.push('/teaching/sessions/demo-session-123');
    }
  };

  return (
    <>
      <Header />
      <Tabs.Root
        value={activeTab.id}
        onValueChange={(val) => {
          const idx = tabFlow.findIndex((t) => t.id === val);
          if (idx !== -1) setTabIndex(idx);
        }}
        className="relative min-h-[calc(100dvh-101px)] flex flex-col bg-surface-slate"
      >
        {/* RED ROW 1: PARENT TOP HEADER BAR */}
        <div className="bg-surface-slate px-8 py-3.5 flex items-center justify-between shrink-0 h-[47px]">
          <h1 className="text-h5 text-secondary-text">
            {activeTab.title}
          </h1>
          <span className="text-h6 text-secondary-text">
            {activeTab.step}
          </span>
        </div>

        {/* RED ROW 2: MAIN CONTENT TAKING FLEX-1 WITH WHITE BACKGROUND */}
        <div className="flex-1 flex flex-col min-h-0 bg-surface-white">
          {tabFlow.map((content) => (
            <Tabs.Panel key={content.id} value={content.id} className="flex-1 flex flex-col min-h-0 bg-surface-white">
              <content.render />
            </Tabs.Panel>
          ))}
        </div>

        {/* RED ROW 3: PARENT STICKY BOTTOM CONTROL BAR */}
        <div className="sticky bottom-0 bg-surface-slate py-3.5 px-8 flex justify-end items-center z-10 shrink-0 h-[58px]">
          <button
            type="button"
            onClick={handleNext}
            className="bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button px-8 py-2.5 rounded-[10px] shadow-sm transition-all cursor-pointer active:scale-98"
          >
            {activeTab.id === 'success' ? 'Go to waiting room' : 'Next'}
          </button>
        </div>
      </Tabs.Root>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* FIRST TAB CONTENT: SELECT MODULE                                           */
/* -------------------------------------------------------------------------- */

const SUBJECTS = [
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { id: 'physics', label: 'Physics', icon: '⚛️' },
  { id: 'engineering', label: 'Engineering', icon: '⚙️' },
];

const YEARS = [
  { id: 'year1', label: 'YEAR 1' },
  { id: 'year2', label: 'YEAR 2' },
  { id: 'year3', label: 'YEAR 3' },
];

const MODULE_CARDS = [
  {
    id: 'm1',
    title: 'Measurement of Physical Quantities',
    duration: '30m',
    level: 'Beginner',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: 'm2',
    title: 'Measurement of Physical Quantities',
    duration: '20m',
    level: 'Intermediate',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: 'm3',
    title: 'Measurement of Physical Quantities',
    duration: '30m',
    level: 'Advance',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: 'm4',
    title: 'Measurement of Physical Quantities',
    duration: '30m',
    level: 'Beginner',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: 'm5',
    title: 'Measurement of Physical Quantities',
    duration: '20m',
    level: 'Intermediate',
    image: '/(new)/module-thumbnail.png',
  },
  {
    id: 'm6',
    title: 'Measurement of Physical Quantities',
    duration: '30m',
    level: 'Advance',
    image: '/(new)/module-thumbnail.png',
  },
];

function SelectTabContent() {
  const [selectedSubject, setSelectedSubject] = useState('chemistry');
  const [selectedYear, setSelectedYear] = useState('year1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('m1');

  return (
    /* RED ROW 2 CONTENT: 2-Column Grid (Green Box 1 + Green Box 2) */
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0">
      {/* GREEN BOX 1 (Left Sidebar: w-[356px] bg-surface-slate with 67px top offset) */}
      <div className="w-full lg:w-[356px] bg-surface-slate pt-[67px] px-6 lg:px-8 pb-8 flex flex-col gap-4 shrink-0">
        {SUBJECTS.map((sub) => {
          const isActive = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubject(sub.id)}
              className={cn(
                'w-full h-[77px] px-8 rounded-[20px] flex items-center gap-3 text-h6 transition-all cursor-pointer',
                {
                  'bg-primary-cta text-primary-text-light shadow-sm': isActive,
                  'bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60': !isActive,
                }
              )}
            >
              <span className="text-2xl">{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* GREEN BOX 2 (Right Container: flex-1 flex flex-col) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* BLUE ROW 1 (Top Blue Box: Year Sub-Tabs aligned with content area below) */}
        <div className="bg-surface-slate px-6 lg:px-10 flex items-center gap-8 h-[63px] shrink-0">
          {YEARS.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => setSelectedYear(y.id)}
              className={cn(
                'h-full flex items-center text-large transition-all border-b-3 cursor-pointer',
                {
                  'border-primary-cta text-primary-text-dark font-semibold': selectedYear === y.id,
                  'border-transparent text-tertiary hover:text-primary-text-dark': selectedYear !== y.id,
                }
              )}
            >
              {y.label}
            </button>
          ))}
        </div>

        {/* BLUE ROW 2 (Bottom Blue Box: White Background Card Area for Search + 3x2 Grid) */}
        <div className="flex-1 bg-surface-white p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto">
          {/* Search Bar */}
          <div className="relative w-full max-w-[333px]">
            <input
              type="text"
              placeholder="Search for topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[50px] bg-primary-subtle border-2 border-primary-light rounded-[10px] pl-4 pr-12 text-normal text-secondary-text placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-tertiary" />
          </div>

          {/* 3x2 Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1020px]">
            {MODULE_CARDS.map((card) => {
              const isSelected = selectedModuleId === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedModuleId(card.id)}
                  className={cn(
                    'w-full h-[263px] rounded-[20px] border-2 overflow-hidden bg-primary-subtle flex flex-col justify-between shadow-xs transition-all cursor-pointer relative group',
                    {
                      'border-primary-cta ring-2 ring-primary-cta/20': isSelected,
                      'border-primary-light hover:border-primary-cta/60': !isSelected,
                    }
                  )}
                >
                  {/* Top Thumbnail Image */}
                  <div className="relative w-full h-[150px] overflow-hidden shrink-0">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 302px"
                      loading="eager"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-subtle via-transparent to-transparent" />
                  </div>

                  {/* Content Info */}
                  <div className="px-5 pb-4 flex flex-col justify-between flex-1">
                    <h4 className="text-normal text-primary-text-dark leading-snug line-clamp-2">
                      {card.title}
                    </h4>

                    {/* Footer Info Row */}
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-caption text-tertiary">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3.5 text-tertiary" />
                          <span>{card.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="size-3.5 text-tertiary" />
                          <span>{card.level}</span>
                        </div>
                      </div>

                      {/* Radio/Select Circle */}
                      <div
                        className={cn(
                          'size-6 rounded-full border border-[#3b494c]/30 flex items-center justify-center transition-all',
                          {
                            'bg-primary-cta border-primary-cta text-primary-text-light': isSelected,
                            'bg-transparent': !isSelected,
                          }
                        )}
                      >
                        {isSelected && <Check className="size-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECOND TAB CONTENT: CONFIGURE SESSION                                      */
/* -------------------------------------------------------------------------- */

function ConfigureTabContent() {
  const [mode, setMode] = useState<'self' | 'control'>('self');
  const [hinting, setHinting] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState('25 students');
  const [allowLateJoin, setAllowLateJoin] = useState(true);

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-10 p-6 lg:p-10 overflow-y-auto bg-surface-white">
      {/* LEFT GREEN BOX: Main Settings Card */}
      <div className="w-full max-w-[648px] bg-primary-subtle rounded-[24px] p-8 flex flex-col gap-8 shrink-0">
        {/* Header Row */}
        <div className="flex items-center justify-between w-full">
          <h3 className="text-normal text-secondary-text">
            Configure your Session
          </h3>
          <div className="bg-surface-white/60 px-3 py-1.5 rounded-full flex items-center gap-2 text-caption font-medium text-tertiary">
            <Info className="size-3.5 text-tertiary" />
            <span>Automatic saving enabled</span>
          </div>
        </div>

        {/* 1. Configure Mode Section */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-normal text-secondary-text">
            Configure Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Self-Paced Option */}
            <div
              onClick={() => setMode('self')}
              className={cn(
                'bg-primary-light rounded-[16px] p-5 cursor-pointer flex flex-col justify-between gap-3 transition-all',
                {
                  'ring-2 ring-primary-cta': mode === 'self',
                  'opacity-90 hover:opacity-100': mode !== 'self',
                }
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'size-[20px] rounded-full border-2 border-primary-cta bg-surface-slate flex items-center justify-center shrink-0 mt-0.5',
                    {
                      'border-primary-cta': mode === 'self',
                    }
                  )}
                >
                  {mode === 'self' && <div className="size-2.5 rounded-full bg-primary-cta" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-normal text-tertiary leading-snug">
                    Self-Paced (Student-paced)
                  </span>
                </div>
              </div>
              <p className="text-caption text-tertiary pl-8">
                Students explore the content at their own speed.
              </p>
            </div>

            {/* Control Option */}
            <div
              onClick={() => setMode('control')}
              className={cn(
                'bg-primary-light rounded-[16px] p-5 cursor-pointer flex flex-col justify-between gap-3 transition-all',
                {
                  'ring-2 ring-primary-cta': mode === 'control',
                  'opacity-90 hover:opacity-100': mode !== 'control',
                }
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'size-[20px] rounded-full border-2 border-primary-cta bg-surface-slate flex items-center justify-center shrink-0 mt-0.5',
                    {
                      'border-primary-cta': mode === 'control',
                    }
                  )}
                >
                  {mode === 'control' && <div className="size-2.5 rounded-full bg-primary-cta" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-normal text-tertiary leading-snug">
                    Control (Teacher-led)
                  </span>
                </div>
              </div>
              <p className="text-caption text-tertiary pl-8">
                You control the pace and guide students step-by-step.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Lab Room Features Section */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-normal text-secondary-text">
            Lab Room Features
          </label>
          <div className="bg-primary-light rounded-[16px] p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-normal text-tertiary">
                Hinting
              </span>
              <span className="text-caption text-[#3f4949]">
                Provide helpful cues during difficult tasks
              </span>
            </div>
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setHinting(!hinting)}
              className={cn(
                'w-[48px] h-[24px] rounded-full p-1 transition-colors cursor-pointer flex items-center',
                {
                  'bg-primary-cta justify-end': hinting,
                  'bg-disable justify-start': !hinting,
                }
              )}
            >
              <div className="size-[16px] rounded-full bg-surface-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* 3. Session Timing Section */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-normal text-secondary-text">
            Session Timing
          </label>
          <div className="flex flex-col gap-2">
            <span className="text-normal text-tertiary">
              Max Participants
            </span>
            <div className="relative w-full max-w-[220px]">
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full bg-primary-light border border-primary-cta/10 rounded-[12px] px-4 py-3 text-normal text-tertiary appearance-none focus:outline-none cursor-pointer pr-10"
              >
                <option value="15 students">15 students</option>
                <option value="25 students">25 students</option>
                <option value="35 students">35 students</option>
                <option value="50 students">50 students</option>
              </select>
              <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-tertiary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. Additional Rules Section */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-normal text-tertiary">
            Additional Rules
          </label>
          <div className="bg-surface-white/40 rounded-[16px] p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-normal text-tertiary">
                Allow Late Join
              </span>
              <span className="text-caption text-tertiary">
                Yes, allow students to join late after session starts
              </span>
            </div>
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setAllowLateJoin(!allowLateJoin)}
              className={cn(
                'w-[48px] h-[24px] rounded-full p-1 transition-colors cursor-pointer flex items-center',
                {
                  'bg-primary-cta justify-end': allowLateJoin,
                  'bg-disable justify-start': !allowLateJoin,
                }
              )}
            >
              <div className="size-[16px] rounded-full bg-surface-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT GREEN BOX: Selected Module Card Summary */}
      <div className="w-[302px] h-[263px] rounded-[20px] border-2 border-primary-light overflow-hidden bg-primary-subtle flex flex-col justify-between shadow-xs relative shrink-0">
        {/* Top Thumbnail Image */}
        <div className="relative w-full h-[150px] overflow-hidden shrink-0">
          <Image
            src="/(new)/module-thumbnail.png"
            alt="Measurement of Physical Quantities"
            fill
            sizes="302px"
            loading="eager"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-subtle via-transparent to-transparent" />
        </div>

        {/* Content Info */}
        <div className="px-5 pb-4 flex flex-col justify-between flex-1">
          <h4 className="text-normal text-primary-text-dark leading-snug line-clamp-2">
            Measurement of Physical Quantities
          </h4>

          {/* Footer Info Row */}
          <div className="pt-2 flex items-center justify-between border-t border-[#3b494c]/10">
            <div className="flex items-center gap-4 text-caption text-tertiary">
              <div className="flex items-center gap-1">
                <Clock className="size-3.5 text-tertiary" />
                <span>30m</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart2 className="size-3.5 text-tertiary" />
                <span>Advance</span>
              </div>
            </div>

            {/* Checkmark Circle */}
            <div className="size-6 rounded-full border border-[#3b494c]/30 flex items-center justify-center bg-primary-cta text-primary-text-light">
              <Check className="size-3.5 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* THIRD TAB CONTENT: SHARE SESSION CODE                                      */
/* -------------------------------------------------------------------------- */

function SuccessTabContent() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const sessionCode = 'ABX472';
  const shareUrl = 'https://meet.google.com/qqf-nywv-gxh';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 overflow-y-auto bg-surface-white">
      <div className="w-full max-w-[860px] flex flex-col gap-4">
        {/* Top Heading Status */}
        <h2 className="text-h6 text-success">
          Session Ready!
        </h2>

        {/* Main 2-Column Content Row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
          {/* Left Column: Code Card & Share Link Bar */}
          <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
            {/* Session Code Card */}
            <div className="bg-primary-subtle rounded-[12px] p-6 lg:p-8 flex flex-col justify-between relative min-h-[237px] w-full">
              {/* Card Header Row */}
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col gap-1">
                  <h3 className="text-large text-secondary-text">
                    Session code
                  </h3>
                  <p className="text-small text-tertiary flex items-center gap-1.5">
                    <span>Atomic Structure</span>
                    <span className="size-1 rounded-full bg-tertiary inline-block" />
                    <span>Chemistry</span>
                    <span className="size-1 rounded-full bg-tertiary inline-block" />
                    <span>Year 1</span>
                  </p>
                </div>

                {/* Copy Button Top Right */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-primary-light border border-primary-cta/20 rounded-[5px] px-2.5 py-1.5 flex flex-col items-center gap-0.5 text-secondary-text text-caption hover:bg-primary-light/80 transition-all cursor-pointer active:scale-95"
                >
                  <Copy className="size-4 text-secondary-text" />
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Big Code Text Center */}
              <div className="text-h1 text-primary-cta tracking-wider text-center my-4">
                {sessionCode}
              </div>
            </div>

            {/* Share Link Bar */}
            <div className="bg-primary-subtle rounded-[12px] px-6 py-3 flex items-center justify-between gap-4 w-full h-[46px]">
              <span className="text-large text-secondary-text shrink-0">
                Share Link
              </span>
              <div className="bg-primary-light rounded-[5px] px-3 py-1.5 text-caption text-secondary-text flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1 hover:text-primary-cta text-secondary-text transition-colors cursor-pointer active:scale-95 shrink-0"
                title="Copy share link"
              >
                {copiedLink ? (
                  <Check className="size-5 text-success" />
                ) : (
                  <Copy className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Right Column: QR Code Card */}
          <div className="bg-primary-subtle rounded-[12px] p-6 lg:p-8 flex items-center justify-center min-w-[300px] min-h-[304px] shrink-0">
            <QRCode value={shareUrl} size={200} bgColor="transparent" fgColor="#459d9f" />
          </div>
        </div>
      </div>
    </div>
  );
}
