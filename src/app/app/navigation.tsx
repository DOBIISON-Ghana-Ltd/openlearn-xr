"use client";

import ProfileCenter from "@/components/particles/profile-center";
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDownIcon, CirclePileIcon, CircleUserRoundIcon, LibraryBigIcon, PencilRulerIcon, UserStarIcon } from "lucide-react";
import Link from "next/link";
import useApi from "@/data/hooks/use-api";
import { getAccessibleSuites } from "@/lib/utils/suite-access";
import { PATHS } from "@/lib/constants/paths";

const links = [
  { icon: LibraryBigIcon, href: PATHS.SIMS.DASHBOARD, label: "Simulation" },
  { icon: CirclePileIcon, href: PATHS.SESSION.DASHBOARD, label: "Sessions" },
  { icon: PencilRulerIcon, href: PATHS.EDITOR.DASHBOARD, label: "Editor" },
  { icon: UserStarIcon, href: PATHS.ADMIN.DASHBOARD, label: "Admin" },
];

export default function Navigation() {
  const { data: user } = useApi.query("app:user:get:me");

  const roles = user?.role || [];
  const subscriptionTier = user?.subscriptionTier || "FREE";
  const isUnlimited = user?.isUnlimited || false;

  const access = getAccessibleSuites(roles, subscriptionTier, isUnlimited);

  const filteredLinks = links.filter(link => {
    if (link.label === "Admin") return access.admin;
    if (link.label === "Editor") return access.editor;
    if (link.label === "Sessions") return access.session;
    return true;
  });

  return (
    <aside className="sticky left-0 top-8 w-12 self-start h-[calc(100dvh-(--spacing(14)))] z-40 overflow-y-auto border-r bg-background flex flex-col justify-between">
      <TooltipProvider delay={0}>
        <ul className="space-y-1">
          {filteredLinks.map((link) => (
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
          <ProfileCenter />
        </div>
      </TooltipProvider>
    </aside>
  )
}