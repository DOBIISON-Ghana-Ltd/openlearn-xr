import { LogoSvg } from "@/components/svgs/logo";
import { BookOpenIcon, PuzzleIcon } from "lucide-react";
import Link from "next/link";

const links = [
  { icon: BookOpenIcon, href: "/app/library", label: "Browse Library", desc: "Explore the library of simulations" },
  { icon: PuzzleIcon, href: "/app/modules", label: "Play Modules", desc: "Engage with interactive learning modules" },
];


export default function Page() {
  return (
    <div className="size-full flex-center flex-col space-y-7">
      <LogoSvg className="size-64 opacity-5" />
      <ul className="space-y-2 w-full max-w-xs">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="flex gap-4 p-3 border hover:bg-muted/50">
              <link.icon strokeWidth={1.5} className="size-5" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-foreground">{link.label}</p>
                <p className="text-xs-m font-normal text-muted-foreground">{link.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}