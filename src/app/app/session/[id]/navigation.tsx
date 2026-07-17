"use client";

import { LayoutDashboard, Trophy, BarChart2, Sliders, Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Navigation() {
  const params = useParams();
  const id = params.id as string;

  const links = [
    { icon: LayoutDashboard, href: `/app/session/${id}`, label: "Overview" },
    { icon: Trophy, href: `/app/session/${id}/leaderboard`, label: "Leaderboard" },
    { icon: BarChart2, href: `/app/session/${id}/analytics`, label: "Analytics" },
    { icon: Sliders, href: `/app/session/${id}/configurations`, label: "Configurations" },
    { icon: Settings, href: `/app/session/${id}/settings`, label: "Settings" },
  ];

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
    </div>
  )
}