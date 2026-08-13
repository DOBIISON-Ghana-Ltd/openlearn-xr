"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface RendererProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Renderer({ children, className }: RendererProps) {
  return (
    <div
      className={cn(
        "flex-1 size-full flex-center p-6 relative overflow-hidden min-h-0",
        className
      )}
    >
      {children}
    </div>
  );
}
