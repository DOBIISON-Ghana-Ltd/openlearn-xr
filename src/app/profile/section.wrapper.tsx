"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

type ISectionWrapper = {
  icon: LucideIcon;
  title: string;
  desc: string;
  children: React.ReactNode
}
export default function SectionWrapper(props: ISectionWrapper) {
  const { title, desc, children } = props;

  return (
    <div className="bg-surface-white rounded-2xl border border-primary-light/40 py-6 space-y-3">
      <div className="px-6 flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary-subtle flex items-center justify-center text-primary-cta shrink-0">
          <props.icon className="size-4.5" />
        </div>
        <div>
          <h3 className="text-h6 font-bold text-primary-cta leading-tight">
            {title}
          </h3>
          <p className="text-caption text-tertiary font-normal">
            {desc}
          </p>
        </div>
      </div>

      <hr className="h-px border-primary-light/40" />

      <div className="px-6 flex gap-3">
        <div className="size-9" />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}