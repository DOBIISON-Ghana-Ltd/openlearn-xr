'use client';

import { Logo } from '@/components/(new)/common/logo';

export default function Entrance() {
  return (
    <div className="relative w-full h-screen min-h-screen bg-surface-white flex items-center overflow-hidden">
      {/* LEFT COLUMN: EXACT FIGMA HERO CONTAINER (NODE 1:1324) */}
      <div className="hidden lg:block relative w-[517px] h-[660px] shrink-0 overflow-hidden ml-6">
        {/* Node 1:1325 Cropped Image Area */}
        <div className="absolute w-[395px] h-[949px] left-[60px] -top-[113px] overflow-hidden">
          <img
            src="/(new)/hero-science.png"
            alt="Open Learn XR Lab"
            className="absolute w-[533%] h-[105%] max-w-none left-[-110%] top-[-2.4%] object-cover"
          />
        </div>

        {/* Left Edge Soft Blur Pill (Node 1:1326) */}
        <div className="absolute left-[37px] top-1/2 -translate-y-1/2 w-[69px] h-[801px] bg-surface-white blur-[10px] pointer-events-none" />

        {/* Right Edge Soft Blur Pill (Node 1:1327) */}
        <div className="absolute left-[385px] top-1/2 -translate-y-1/2 w-[69px] h-[801px] bg-surface-white blur-[10px] pointer-events-none" />
      </div>

      {/* RIGHT COLUMN: CENTERED FORM MATCHING FIGMA NODE 1:1328 */}
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 lg:p-12 min-w-0">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-[27px]">
          {/* OPENLEARNXR Logo */}
          <div className="flex justify-center mb-1">
            <Logo className="w-[187px] h-auto" />
          </div>

          {/* Heading */}
          <h1 className="text-h6 text-primary-text-dark text-center">
            Join a Session
          </h1>

          {/* Inputs & CTA Container */}
          <div className="w-full flex flex-col gap-[27px]">
            {/* Full Name Input */}
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full h-[42px] bg-surface-white border border-primary-cta/20 rounded-[8px] px-[17px] py-[12px] text-small text-primary-text-dark placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-colors"
            />

            {/* Session Code or Link Input */}
            <input
              type="text"
              placeholder="Enter session code or link"
              className="w-full h-[42px] bg-surface-white border border-primary-cta/20 rounded-[8px] px-[17px] py-[12px] text-small text-primary-text-dark placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-colors"
            />

            {/* Join CTA Button */}
            <button
              type="button"
              className="w-full h-[52px] bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-[8px] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-98"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}