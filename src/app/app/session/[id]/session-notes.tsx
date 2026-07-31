"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import useApi from "@/data/hooks/use-api";
import React from "react";

export default function SessionNotes() {
  const params = useParams();
  const id = params.id as string;

  const { data } = useApi.query("ses:session:get:notes", { id });

  return (
    <div className="sticky right-0 top-8 w-96 self-start h-[calc(100dvh-(--spacing(14)))] z-30 border-l bg-background">
      <ScrollArea className="h-full">
        <div className="px-4">
          <div className="h-9 flex-center justify-start">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</h2>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}