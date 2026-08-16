"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronsUpDownIcon } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import useApi from "@/data/hooks/use-api";
import { IFormInput } from "./client";
import ModuleCard from "./module-card";

export default function ConfigureTab() {
  const { control, watch } = useFormContext<IFormInput>();
  const moduleId = watch("moduleId");

  const { data: moduleData } = useApi.query("ses:module:get:one", { id: moduleId }, Boolean(moduleId));

  const paceControl = useController({ control, name: "config.controlMode" });
  const hintControl = useController({ control, name: "config.allowHints" });
  const maxAdmissionsControl = useController({ control, name: "config.maxAdmissions" });
  const lateJoinControl = useController({ control, name: "config.allowLateAdmissions" });

  const isSelfPaced = paceControl.field.value === "self-paced";
  const isTutorLed = paceControl.field.value === "tutor-led";

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-10 p-6 lg:p-10 overflow-y-auto bg-surface-white">
      {/* LEFT GREEN BOX: Main Settings Card */}
      <div className="w-full max-w-[648px] bg-primary-subtle rounded-[24px] p-8 flex flex-col gap-8 shrink-0">
        {/* Header Row */}
        <div className="flex items-center justify-between w-full">
          <h3 className="text-normal text-secondary-text">
            Configure your Session
          </h3>
        </div>

        {/* 1. Configure Mode Section */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-normal text-secondary-text">
            Configure Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Self-Paced Option */}
            <div
              onClick={() => paceControl.field.onChange("self-paced")}
              className={cn(
                'bg-primary-light rounded-[16px] p-5 cursor-pointer flex flex-col justify-between gap-3 transition-all',
                {
                  'ring-2 ring-primary-cta': isSelfPaced,
                  'opacity-90 hover:opacity-100': !isSelfPaced,
                }
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'size-[20px] rounded-full border-2 border-primary-cta bg-surface-slate flex items-center justify-center shrink-0 mt-0.5',
                    {
                      'border-primary-cta': isSelfPaced,
                    }
                  )}
                >
                  {isSelfPaced && <div className="size-2.5 rounded-full bg-primary-cta" />}
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
              onClick={() => paceControl.field.onChange("tutor-led")}
              className={cn(
                'bg-primary-light rounded-[16px] p-5 cursor-pointer flex flex-col justify-between gap-3 transition-all',
                {
                  'ring-2 ring-primary-cta': isTutorLed,
                  'opacity-90 hover:opacity-100': !isTutorLed,
                }
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'size-[20px] rounded-full border-2 border-primary-cta bg-surface-slate flex items-center justify-center shrink-0 mt-0.5',
                    {
                      'border-primary-cta': isTutorLed,
                    }
                  )}
                >
                  {isTutorLed && <div className="size-2.5 rounded-full bg-primary-cta" />}
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
              onClick={() => hintControl.field.onChange(!hintControl.field.value)}
              className={cn(
                'w-[48px] h-[24px] rounded-full p-1 transition-colors cursor-pointer flex items-center',
                {
                  'bg-primary-cta justify-end': Boolean(hintControl.field.value),
                  'bg-disable justify-start': !Boolean(hintControl.field.value),
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
                value={maxAdmissionsControl.field.value ?? 50}
                onChange={(e) => maxAdmissionsControl.field.onChange(Number(e.target.value))}
                className="w-full bg-primary-light border border-primary-cta/10 rounded-[12px] px-4 py-3 text-normal text-tertiary appearance-none focus:outline-none cursor-pointer pr-10"
              >
                <option value={15}>15 students</option>
                <option value={25}>25 students</option>
                <option value={35}>35 students</option>
                <option value={50}>50 students</option>
              </select>
              <ChevronsUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-tertiary pointer-events-none" />
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
              onClick={() => lateJoinControl.field.onChange(!lateJoinControl.field.value)}
              className={cn(
                'w-[48px] h-[24px] rounded-full p-1 transition-colors cursor-pointer flex items-center',
                {
                  'bg-primary-cta justify-end': Boolean(lateJoinControl.field.value),
                  'bg-disable justify-start': !Boolean(lateJoinControl.field.value),
                }
              )}
            >
              <div className="size-[16px] rounded-full bg-surface-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT GREEN BOX: Selected Module Card Summary */}
      <div className="w-[302px] shrink-0">
        {moduleData ? (
          <ModuleCard data={moduleData} />
        ) : (
          <div className="w-[302px] h-[263px] rounded-[20px] border-2 border-primary-light bg-primary-subtle flex items-center justify-center text-caption text-tertiary">
            No module selected
          </div>
        )}
      </div>
    </div>
  );
}