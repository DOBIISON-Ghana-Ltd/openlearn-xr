"use client";

import { BookOpenIcon, LayoutDashboard, PuzzleIcon } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/lib/constants/paths";

const links = [
  { icon: LayoutDashboard, href: PATHS.SIMS.DASHBOARD, label: "Home" },
  { icon: BookOpenIcon, href: PATHS.SIMS.LIBRARY.ROOT, label: "Library" },
  { icon: PuzzleIcon, href: PATHS.SIMS.MODULES, label: "Modules" },
];

export default function Navigation() {
  return (
    <div className="sticky left-12 top-8 w-60 self-start h-[calc(100dvh-(--spacing(14)))] z-30 overflow-y-auto border-r bg-background">
      <ul className="py-4">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className="flex items-center gap-3 mx-1 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide">
              <link.icon strokeWidth={1.5} className="size-4.5" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* <div className="space-y-2">
        <p className="text-xs-m capitalize font-medium text-muted-foreground px-4">Recents</p>
        <ul>
          {recentLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="block max-w-full mx-1 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full whitespace-nowrap overflow-hidden text-ellipsis">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}