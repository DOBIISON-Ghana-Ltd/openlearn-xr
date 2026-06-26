"use client";

import { BookIcon, BookOpenIcon, LayoutDashboard, PuzzleIcon } from "lucide-react";
import Link from "next/link";

const links = [
  { icon: LayoutDashboard, href: "/app", label: "Home" },
  { icon: BookOpenIcon, href: "/app/library", label: "Library" },
  { icon: PuzzleIcon, href: "/app/modules", label: "Modules" },
];

const recentLinks = [
  { label: "Pressure Changes with Depth", href: "/app" },
  { label: "Detecting Charge with a Gold Leaf Electroscope", href: "/app" },
  { label: "Determination of Density", href: "/app" },
  { label: "Determine Coefficient of Friction", href: "/app" },
  { label: "Series and Parallel Connections of Capacitors", href: "/app" },
  { label: "Behaviour of a Capacitor in DC and AC Circuits", href: "/app" },
  { label: "Model Ionic Bonds and Crystals", href: "/app" },
]

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
      <div className="space-y-2">
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
      </div>
    </div>
  )
}