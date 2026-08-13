"use client";

import { cn } from "@/lib/utils/cn";
import { BarChart2Icon, CheckIcon, ClockIcon } from "lucide-react";
import ImageWithFallback from "@/components/(new)/image-with-fallback";
import { useFormContext } from "react-hook-form";
import { Infer } from "@/data/types.base";
import { IFormInput } from "./client";
import { match } from "ts-pattern";

type ModuleCardProps = {
  data: Infer["SesModuleGetOne"]["res"];
  onClick?: () => void;
};

export default function ModuleCard({ data, onClick }: ModuleCardProps) {
  const { watch, setValue } = useFormContext<IFormInput>();
  const selectedModuleId = watch("moduleId");
  const isSelected = selectedModuleId === data.id;
  const { title, duration, difficulty, image } = data.module;

  const handleSelect = () => {
    setValue("moduleId", data.id, { shouldDirty: true, shouldValidate: true });
    onClick?.();
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "w-full h-[263px] rounded-[20px] border-2 overflow-hidden bg-primary-subtle flex flex-col justify-between shadow-xs transition-all cursor-pointer relative group",
        {
          "border-primary-cta ring-2 ring-primary-cta/20": isSelected,
          "border-primary-light hover:border-primary-cta/60": !isSelected,
        }
      )}
    >
      {/* Top Thumbnail Image */}
      <div className="relative w-full h-[150px] overflow-hidden shrink-0">
        <ImageWithFallback
          src={image}
          fallbackSrc="/(new)/module-thumbnail.png"
          alt={title}
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
          {title}
        </h4>

        {/* Footer Info Row */}
        <div className="pt-2 flex items-center justify-between border-t border-[#3b494c]/10">
          <div className="flex items-center gap-4 text-caption text-tertiary">
            <div className="flex items-center gap-1">
              <ClockIcon className="size-3.5 text-tertiary" />
              <span>{duration || "30m"}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart2Icon className="size-3.5 text-tertiary" />
              <span className="capitalize">
                {match(difficulty)
                  .with("EAZY", () => "Easy")
                  .with("MEDIUM", () => "Medium")
                  .with("HARD", () => "Hard")
                  .exhaustive()
                }
              </span>
            </div>
          </div>

          {/* Select Circle */}
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
        </div>
      </div>
    </div>
  );
}
