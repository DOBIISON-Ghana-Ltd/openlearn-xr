"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/lib/constants/paths";
import { Button } from "@/components/ui/button";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";

type IProps = {
  data: Infer["SimCollectionGetAll"]["res"][number];
};

export default function BookCard(props: IProps) {
  const router = useRouter();
  const { data: { id, name, level, _count } } = props;

  const total = _count?.modules ?? 0;
  const isComingSoon = total === 0;

  return (
    <div className="relative w-full aspect-video p-4 flex flex-col gap-2 border">
      <div className="flex justify-between items-center">
        <p className="text-xs-m font-normal font-mono tracking-wide">
          00/{total.toString().padStart(2, "0")}
        </p>
      </div>
      <div className="flex-1 space-y-0">
        <h3 className="text-base leading-snug">{name}</h3>
        <p className="text-sm text-muted-foreground font-normal">
          {level}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          size="sm"
          variant={isComingSoon ? "secondary" : "default"}
          className="w-full rounded-none"
          disabled={isComingSoon}
          onClick={() => {
            const url = nuqs.getUrl("sim:library", { collectionId: id }, PATHS.SIMS.LIBRARY.ROOT);
            router.push(url);
          }}
        >
          {isComingSoon ? "Coming Soon" : "Explore"}
        </Button>
      </div>
    </div>
  );
}
