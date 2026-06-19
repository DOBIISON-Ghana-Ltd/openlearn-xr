"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ArrowRightIcon, BeakerIcon, TrophyIcon, UsersIcon, Atom, TestTube2, Dna, Play } from "lucide-react";
import useApi from "@/data/hooks/use-api";
import Link from "next/link";

export default function ClientPage() {
  const { data } = useApi.query("public:user:get:me");
  const userName = data?.name || "User";

  return (
    <div className="flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="flex flex-col pb-12">

          {/* Welcome Banner */}
          <div className="relative w-full rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 p-8 text-white shadow-md dark:from-emerald-950 dark:to-emerald-900 mb-8 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/3 -translate-y-1/4">
              <Atom className="size-64" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold">Welcome, {userName}!</h2>
              <p className="mt-2 text-emerald-50 text-base max-w-xl">
                Ready to explore interactive 3D science simulations?
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/me/editor">
                  <Button className="bg-white border-white text-emerald-700 hover:bg-emerald-50 h-10 px-6">
                    Open Module Editor
                    <ArrowRightIcon className="size-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/me/sessions">
                  <Button variant="outline" className="bg-emerald-700/20 border-emerald-400 text-white hover:bg-emerald-700/40 hover:text-white h-10 px-6">
                    Host a Lab Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
            <FilterChip icon={<Atom className="size-4" />} label="Physics" />
            <FilterChip icon={<TestTube2 className="size-4" />} label="Chemistry" />
            <FilterChip icon={<Dna className="size-4" />} label="Biology" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
            <Card className="bg-sidebar">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">My Plays</CardTitle>
                  <div className="text-2xl font-bold">12</div>
                </div>
                <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <TrophyIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Completed simulation runs</p>
              </CardContent>
            </Card>

            <Card className="bg-sidebar">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Labs</CardTitle>
                  <div className="text-2xl font-bold">4</div>
                </div>
                <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <BeakerIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Science modules available</p>
              </CardContent>
            </Card>

            <Card className="bg-sidebar">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Hosted Sessions</CardTitle>
                  <div className="text-2xl font-bold">2</div>
                </div>
                <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <UsersIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Collaborative group play</p>
              </CardContent>
            </Card>
          </div>

          {/* Section: Recommended Modules */}
          <div className="mb-10">
            <div className="flex items-center gap-1 mb-6 text-base font-semibold text-foreground">
              <span>Recommended Modules</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ModuleCard 
                title="Cell Structure (3D)"
                subject="Biology"
                imageColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"
                icon={<Dna className="size-12 opacity-50" />}
              />
              <ModuleCard 
                title="Newton's Laws of Motion"
                subject="Physics"
                imageColor="bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                icon={<Atom className="size-12 opacity-50" />}
              />
              <ModuleCard 
                title="The Periodic Table"
                subject="Chemistry"
                imageColor="bg-purple-100 dark:bg-purple-900/30 text-purple-500"
                icon={<TestTube2 className="size-12 opacity-50" />}
              />
              <ModuleCard 
                title="Photosynthesis"
                subject="Biology"
                imageColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"
                icon={<Dna className="size-12 opacity-50" />}
              />
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}

function FilterChip({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 h-10 px-5 rounded-full border border-sidebar-border/60 bg-sidebar hover:bg-sidebar-accent hover:border-emerald-500/50 text-sm font-medium transition-colors whitespace-nowrap shrink-0 group">
      <div className="text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

function ModuleCard({ title, subject, imageColor, icon }: { title: string, subject: string, imageColor: string, icon: React.ReactNode }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      {/* 3D Lab Placeholder Image */}
      <div className={`w-full aspect-video rounded-xl ${imageColor} flex items-center justify-center overflow-hidden border border-border/50 relative shadow-sm transition-transform group-hover:scale-[1.02]`}>
        {icon}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="size-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <Play className="size-4 text-emerald-600 translate-x-0.5" />
          </div>
        </div>
      </div>
      
      {/* Meta */}
      <div className="flex flex-col gap-1 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subject}</span>
        <span className="text-base font-medium text-foreground leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</span>
      </div>
    </div>
  );
}
