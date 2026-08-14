"use client";

import Link from "next/link";
import { BarChart2, CheckIcon, Clock, Play } from "lucide-react";
import ImageWithFallback from "@/components/(new)/image-with-fallback";
import { cn } from "@/lib/utils/cn";
import { match } from "ts-pattern";

export type ModuleCardData = {
  id: string;
  module: {
    title: string;
    image: string;
    duration?: string | null;
    difficulty?: string | null;
  };
};

export type ModuleCardProps = {
  data: ModuleCardData;
  actionType?: "play" | "select";
  isSelected?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export default function ModuleCard({
  data,
  actionType = "play",
  isSelected = false,
  onClick,
  href,
  className,
}: ModuleCardProps) {
  const { title, duration, difficulty, image } = data.module;

  const difficultyLabel = match(difficulty)
    .with("EAZY", () => "Easy")
    .with("MEDIUM", () => "Medium")
    .with("HARD", () => "Hard")
    .otherwise(() => difficulty || "Easy");

  const cardContent = (
    <>
      {/* Card Thumbnail Top Section */}
      <div className="relative w-full h-[160px] overflow-hidden shrink-0">
        <ImageWithFallback
          src={image}
          fallbackSrc="/(new)/module-thumbnail.png"
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          loading="eager"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Bottom Content Section with Frosted Glass Overlay */}
      <div className="p-4 bg-surface-white/70 backdrop-blur-[5px] flex flex-col justify-between gap-4 flex-1 border-t border-primary-light/80">
        <h3 className="text-normal text-primary-text-dark leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="pt-3 border-t border-[#3b494c]/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-caption text-tertiary">
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>{duration || "30m"}</span>
            </div>

            <div className="flex items-center gap-1">
              <BarChart2 className="size-3.5" />
              <span className="capitalize">{difficultyLabel}</span>
            </div>
          </div>

          {actionType === "select" ? (
            <div
              className={cn(
                "size-6 rounded-full border border-[#3b494c]/30 flex items-center justify-center transition-all",
                {
                  "bg-primary-cta border-primary-cta text-primary-text-light": isSelected,
                  "bg-transparent text-transparent": !isSelected,
                }
              )}
            >
              <CheckIcon className="size-3.5 stroke-3 transition-colors" />
            </div>
          ) : (
            <div className="size-6 rounded-full border border-[#3b494c]/30 flex items-center justify-center text-[#3b494c] group-hover:border-primary-cta group-hover:text-primary-cta transition-colors">
              <Play className="size-3 fill-current ml-0.5" />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const containerClasses = cn(
    "group bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden flex flex-col relative transition-all duration-200 hover:shadow-md cursor-pointer",
    {
      "border-primary-cta ring-2 ring-primary-cta/20": isSelected,
      "hover:border-primary-cta/40": !isSelected,
    },
    className
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={containerClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={containerClasses}>
      {cardContent}
    </div>
  );
}
