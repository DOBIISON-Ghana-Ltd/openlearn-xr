"use client";

import { Trash2Icon } from "lucide-react";

export default function DeleteSection() {
  return (
    <div className="bg-surface-white rounded-2xl border border-error/20 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
          <Trash2Icon className="size-4.5" />
        </div>
        <div>
          <h3 className="text-h6 font-bold text-error leading-tight">
            Delete Account
          </h3>
          <p className="text-caption text-tertiary font-normal">
            Permanently delete your account and all data.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="px-4 py-2 rounded-xl border border-error/30 text-error hover:bg-error/10 font-semibold text-caption transition-colors self-start sm:self-auto"
      >
        Delete Account
      </button>
    </div>
  )
}