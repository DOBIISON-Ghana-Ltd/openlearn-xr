"use client";

import HeaderLoginBtn from "@/components/particles/app/header-login-btn";
import HeaderUserStats from "@/components/particles/app/header-user-stats";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full h-8 flex items-center justify-between z-50 border-b px-3 py-1 bg-background">
      <div className="h-full flex items-center gap-2">
        <Image
          src="/brand/logo-light.png"
          alt="Openlearn"
          width={140}
          height={38}
          className="h-full w-auto object-contain"
          priority
        />
        <h2 className="text-sm font-medium uppercase text-muted-foreground">OpenLearn XR</h2>
      </div>
      <div className="flex-center gap-2">
        <HeaderUserStats />
        <HeaderLoginBtn />
      </div>
    </header>
  )
}