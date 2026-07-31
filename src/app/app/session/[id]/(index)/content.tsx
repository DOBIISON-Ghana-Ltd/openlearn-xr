"use client";

import useApi from "@/data/hooks/use-api";
import { IClientPage } from "./client";
import Image from "next/image";
import { AVATARS } from "@/lib/constants/avatars";
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type IContent = {} & Pick<IClientPage, "id">;

export default function Content(props: IContent) {
  const { id } = props;
  return (
    <div className="w-full px-5 space-y-7">
      <Activities />
      <Players id={id} />
      <Analytics />
      {/* <div className="w-full flex-center px-4 py-3 round-md border">
        Actions to export as pdf, docs, excel, png
      </div> */}
    </div>
  );
}

function Activities() {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-44 bg-background border rounded-md flex-center">

      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Realtime Activities taking place
        </p>
      </div>
    </div>
  );
}

type IPlayers = {} & Pick<IClientPage, "id">;

function Players(props: IPlayers) {
  const { id } = props;
  const { data } = useApi.query("ses:session:get:player-summary", { id });

  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-20 bg-background border rounded-md flex items-center">
        <TooltipProvider>
          <div className="size-full flex items-center justify-start gap-4 px-4 overflow-x-auto">
            {data?.map((item, idx) => {
              const avatarSrc = AVATARS[item.avatar as keyof typeof AVATARS] || AVATARS["avatar-01"];
              const points = item.playAttempt?.accumulatedPoints ?? item.score ?? 0;

              return (
                <Tooltip key={item.name + idx}>
                  <TooltipTrigger
                    className="relative shrink-0 size-13 rounded-full border bg-muted group cursor-pointer transition-transform hover:scale-105"
                    render={<div />}
                  >
                    <div className="relative size-full rounded-full overflow-hidden">
                      <Image
                        fill
                        sizes="52px"
                        src={avatarSrc}
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 z-10 flex items-center justify-center px-1.5 min-w-5 h-4.5 text-[10px] font-semibold text-primary-foreground bg-primary rounded-full border-2 border-background shadow-xs select-none">
                      {points}
                    </span>
                  </TooltipTrigger>
                  <TooltipPopup side="top">
                    {item.name}
                  </TooltipPopup>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Top 10 Players
        </p>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-0.5">
      <div className="w-full h-64 bg-background border rounded-md flex-center">

      </div>
      <div className="p-2">
        <p className="text-sm text-muted-foreground font-normal">
          Completion rate
        </p>
      </div>
    </div>
  );
}
