"use client";

import { LayoutDashboard, Users, CreditCard, Mail, BarChart3 } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/lib/constants/paths";

export default function Navigation() {
  const links = [
    { icon: LayoutDashboard, href: PATHS.ADMIN.DASHBOARD, label: "Dashboard" },
    { icon: BarChart3, href: PATHS.ADMIN.ANALYTICS, label: "Analytics" },
    { icon: Users, href: PATHS.ADMIN.USERS, label: "Users" },
    { icon: CreditCard, href: PATHS.ADMIN.SUBSCRIPTIONS, label: "Subscriptions" },
    { icon: Mail, href: PATHS.ADMIN.EMAIL, label: "Email Logs" },
  ];

  return (
    <div className="sticky left-12 top-8 w-60 self-start h-[calc(100dvh-(--spacing(14)))] z-30 overflow-y-auto border-r bg-background">
      <ul className="py-4">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="flex items-center gap-3 mx-1 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide"
            >
              <link.icon strokeWidth={1.5} className="size-4.5" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
