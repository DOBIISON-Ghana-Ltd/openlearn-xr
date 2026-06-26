"use client";

import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDownIcon, CirclePileIcon, CircleUserRoundIcon, LibraryBigIcon, PencilRulerIcon, UserStarIcon } from "lucide-react";
import Link from "next/link";

const links = [
  { icon: LibraryBigIcon, href: "/app", label: "Simulation" },
  { icon: CirclePileIcon, href: "/app/session", label: "Sessions" },
  { icon: PencilRulerIcon, href: "/app/editor", label: "Editor" },
  { icon: UserStarIcon, href: "/app/admin", label: "Admin" },
]

export default function Navigation() {
  return (
    <aside className="sticky left-0 top-8 w-12 self-start h-[calc(100dvh-(--spacing(14)))] z-40 overflow-y-auto border-r bg-background flex flex-col justify-between">
      <TooltipProvider>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.label} className="w-full aspect-square">
              <Tooltip>
                <TooltipTrigger render={<Link href={link.href} />} className="group size-full flex-center">
                  <link.icon strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground" />
                </TooltipTrigger>
                <TooltipPopup side="right">{link.label}</TooltipPopup>
              </Tooltip>
            </li>
          ))}
        </ul>
        <div>
          <Tooltip>
            <TooltipTrigger className="group w-full aspect-square flex-center">
              <div className="size-7 rounded-full bg-red-400"></div>
            </TooltipTrigger>
            <TooltipPopup side="right">Organization</TooltipPopup>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Link href="/app/profile" />} className="group aspect-square flex-center">
              <CircleUserRoundIcon strokeWidth={1.5} className="size-7 text-muted-foreground group-hover:text-foreground" />
            </TooltipTrigger>
            <TooltipPopup side="right">Profile</TooltipPopup>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  )
}