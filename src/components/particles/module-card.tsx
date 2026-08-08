"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { PATHS } from '@/lib/constants/paths';
import { useRouter } from 'next/navigation';
import { BadgeCheckIcon, PlayIcon } from 'lucide-react';
import { Infer } from '@/data/types.base';
import { match } from 'ts-pattern';
import { useACL } from '@/hooks/use-acl';
import { nuqs } from '@/lib/utils/nuqs';

type IProps = {
  mode: "session" | "module" | "library";
  data: Infer["SimModuleGetAll"]["res"][number];
};

export default function ModuleCard(props: IProps) {
  const router = useRouter();
  const { canStartSession } = useACL();
  const { data: { id, status, module, _count }, mode } = props;

  const buttonVariant = match({ status, mode, canStartSession })
    .with({ status: "DRAFT" }, () => "DRAFT_DISABLED" as const)
    .with({ mode: "library" }, () => "PLAY_ONLY" as const)
    .with({ canStartSession: true }, () => "DUAL_SESSION_PLAY" as const)
    .otherwise(() => "PLAY_ONLY" as const);

  return (
    <div className="relative w-full aspect-video p-4 flex flex-col gap-2 border">
      <div className="flex justify-between items-center">
        <p className="text-xs-m font-normal font-mono tracking-wide">
          00/{(_count?.checkpoints ?? 0).toString().padStart(2, "0")}
        </p>
        <BadgeCheckIcon className="text-muted-foreground size-4" />
      </div>
      <div className="flex-1">
        <h3 className="text-base leading-snug">{module.title}</h3>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <p className="text-xs-m text-muted-foreground font-normal">
            {`${module.collection.name} • ${module.collection.grade}`}
          </p>
        </div>
        {match(buttonVariant)
          .with("DRAFT_DISABLED", () => (
            <Button
              size="sm"
              variant="secondary"
              className="w-full rounded-none"
              disabled
            >
              Coming Soon
            </Button>
          ))
          .with("PLAY_ONLY", () => (
            <Button
              size="sm"
              className="w-full rounded-none"
              onClick={() => router.push(PATHS.SIMS.PLAY(mode, id))}
            >
              Play
            </Button>
          ))
          .with("DUAL_SESSION_PLAY", () => (
            <div className="flex items-center gap-0.5">
              <Button
                size="sm"
                className="flex-1 rounded-none"
                onClick={() => {
                  const url = nuqs.getUrl("ses:dashboard", { new: "true", moduleId: id }, PATHS.SESSION.DASHBOARD);
                  router.push(url);
                }}
              >
                Start Session
              </Button>
              <Button
                size="icon-sm"
                className="rounded-none shrink-0"
                onClick={() => router.push(PATHS.SIMS.PLAY(mode, id))}
              >
                <PlayIcon className="size-4" />
              </Button>
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}
