"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { useFormContext } from "react-hook-form";
import { useClipboard } from "@mantine/hooks";
import useApi from "@/data/hooks/use-api";
import { getShareUrl } from "@/lib/utils/get-share-url";
import { IFormInput } from "./client";

export default function SuccessTab() {
  const clipboardCode = useClipboard({ timeout: 2000 });
  const clipboardLink = useClipboard({ timeout: 2000 });

  const { watch } = useFormContext<IFormInput>();
  const sessionCode = watch("joinCode") || "";
  const moduleId = watch("moduleId");

  const { data: moduleData } = useApi.query(
    "ses:module:get:one",
    { id: moduleId },
    Boolean(moduleId)
  );

  const shareUrl = sessionCode
    ? getShareUrl(sessionCode, sessionCode)
    : "https://openlearnxr.org";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 overflow-y-auto bg-surface-white">
      <div className="w-full max-w-[850px] flex flex-col gap-6">
        {/* Top Heading Status */}
        <h2 className="text-h6 text-success font-semibold">
          Session Ready!
        </h2>

        {/* Main 2-Column Content Row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
          {/* Left Column: Code Card & Share Link Bar */}
          <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
            {/* Session Code Card */}
            <div className="bg-primary-subtle rounded-2xl p-6 lg:p-7 flex flex-col justify-between relative min-h-[220px] w-full">
              {/* Card Header Row */}
              <div className="flex items-start justify-between w-full gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-large text-secondary-text font-semibold">
                    Session code
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 text-caption text-tertiary">
                    <span className="truncate max-w-[200px]">{moduleData?.module.title || "Module"}</span>
                    <span className="size-1 rounded-full bg-tertiary shrink-0" />
                    <span className="shrink-0">{moduleData?.module.duration || "30m"}</span>
                    <span className="size-1 rounded-full bg-tertiary shrink-0" />
                    <span className="capitalize shrink-0">{moduleData?.module.difficulty ? moduleData.module.difficulty.toLowerCase() : "beginner"}</span>
                  </div>
                </div>

                {/* Copy Button Top Right */}
                <button
                  type="button"
                  onClick={() => clipboardCode.copy(sessionCode)}
                  className="bg-primary-light border border-primary-cta/20 rounded-[8px] px-3 py-2 flex items-center gap-1.5 text-secondary-text text-caption hover:bg-primary-light/80 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <CopyIcon className="size-3.5 text-secondary-text" />
                  <span>{clipboardCode.copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Text Center */}
              <div className="text-[32px] lg:text-[36px] font-bold text-primary-cta tracking-wider text-center my-4 font-mono whitespace-nowrap overflow-x-auto">
                {sessionCode}
              </div>
            </div>

            {/* Share Link Bar */}
            <div className="bg-primary-subtle rounded-2xl px-6 py-3 flex items-center justify-between gap-4 w-full h-14">
              <span className="text-normal text-secondary-text font-medium shrink-0">
                Share Link
              </span>
              <div className="bg-primary-light rounded-[8px] px-3 py-2 text-caption text-secondary-text flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={() => clipboardLink.copy(shareUrl)}
                className="p-2 hover:text-primary-cta text-secondary-text transition-colors cursor-pointer active:scale-95 shrink-0"
                title="Copy share link"
              >
                {clipboardLink.copied ? (
                  <CheckIcon className="size-5 text-success" />
                ) : (
                  <CopyIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Right Column: QR Code Card */}
          <div className="bg-primary-subtle rounded-2xl p-6 lg:p-7 flex items-center justify-center w-full lg:w-[260px] h-[290px] shrink-0">
            <QRCode value={shareUrl} size={190} bgColor="transparent" fgColor="#3b494c" />
          </div>
        </div>
      </div>
    </div>
  );
}