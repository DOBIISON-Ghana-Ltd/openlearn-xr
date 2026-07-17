"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import useApi from "@/data/hooks/use-api";
import React from "react";

interface DocNode {
  type: string;
  attrs?: Record<string, any>;
  content?: DocNode[];
  text?: string;
}

// Simple custom TipTap JSON renderer for rendering rich-text content to standard HTML elements
const renderTipTapJSON = (node: DocNode | null): React.ReactNode => {
  if (!node) return null;

  if (node.type === "text") {
    return node.text;
  }

  const children = node.content 
    ? node.content.map((child, i) => (
        <React.Fragment key={i}>{renderTipTapJSON(child)}</React.Fragment>
      ))
    : null;

  switch (node.type) {
    case "doc":
      return <div className="space-y-4">{children}</div>;
    case "heading":
      const level = node.attrs?.level || 1;
      if (level === 2) {
        return <h3 className="text-sm font-semibold text-foreground border-b pb-1.5 mt-6 mb-2">{children}</h3>;
      }
      return <h2 className="text-base font-bold text-foreground mt-8 mb-3">{children}</h2>;
    case "paragraph":
      return <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{children}</p>;
    default:
      return children;
  }
};

export default function SessionNotes() {
  const params = useParams();
  const id = params.id as string;

  const { data: session } = useApi.query("public:session:get:overview", id);
  const overview = session?.moduleVersion.module.overview;

  return (
    <div className="sticky right-0 top-8 w-84 self-start h-[calc(100dvh-(--spacing(14)))] z-30 border-l bg-background">
      <ScrollArea className="h-full">
        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Module Overview</h2>
          </div>
          {overview ? (
            renderTipTapJSON(overview as DocNode)
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No overview information provided for this module.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}