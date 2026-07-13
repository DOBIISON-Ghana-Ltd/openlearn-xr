"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { ChevronDownIcon, CircleUserRoundIcon, CrownIcon, PlusIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import useApi from "@/data/hooks/use-api";

export default function ProfileCenter() {
  const { data } = useApi.query('public:user:get:me');

  const userTabs = [
    { icon: UserIcon, label: "Profile", onclick: () => { } },
  ];

  const orgTabs = [
    { icon: SettingsIcon, label: "Preferences", onclick: () => { } },
    { icon: UsersIcon, label: "Members", onclick: () => { } },
    { icon: CrownIcon, label: "License", onclick: () => { } },
  ];

  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger render={<TooltipTrigger />} className="group w-full aspect-square flex-center">
          <CircleUserRoundIcon strokeWidth={1.5} className="size-7 text-muted-foreground group-hover:text-foreground" />
        </DialogTrigger>
        <TooltipPopup side="right">Profile</TooltipPopup>
      </Tooltip>

      <DialogPopup className="sm:max-w-4xl min-h-[80dvh] rounded-sm overflow-hidden">
        <div className="size-full flex-center">
          <div className="bg-muted/20 w-56 h-full border-r flex flex-col">
            <div className="p-2">
              <div className="border bg-background rounded-md overflow-hidden space-y-2">
                {/* ORG INFO + PLAN */}
                <div className="flex gap-2 items-center px-2 pt-2">
                  <div className="self-start w-10 aspect-square bg-purple-400 rounded-xs"></div>
                  <div className="flex flex-col">
                    <p className="text-sm-m font-normal text-foreground">Delali's Org</p>
                    <p className="self-start font-medium text-xs text-background px-1 bg-foreground">Free</p>
                  </div>
                </div>
                {/* ADD OR SWITCH ORGANISATION */}
                <div className="flex items-center px-2 pb-2 gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <PlusIcon />
                    New Orgnization
                  </Button>
                  <Button variant="outline" size="icon-sm">
                    <ChevronDownIcon />
                  </Button>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 size-full">
              <div className="h-full flex-center flex-col items-start">
                <ul className="py-4 w-full">
                  {userTabs.map((tab, index) => (
                    <li key={index} className="w-full">
                      <button className="w-full flex items-center gap-3 mx-1 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide">
                        <tab.icon strokeWidth={1.5} className="size-4.5" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 w-full">
                  <p className="text-xs-m capitalize font-medium text-muted-foreground px-4">Recents</p>
                  <ul className="w-full">
                    {orgTabs.map((tab) => (
                      <li key={tab.label} className="w-full">
                        <button className="w-full flex items-center gap-3 mx-1 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide">
                          <tab.icon strokeWidth={1.5} className="size-4.5" />
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
          <ScrollArea className="flex-1 h-full">
            <div className="h-full flex-center">
              content
            </div>
          </ScrollArea>
        </div>
      </DialogPopup>
    </Dialog>
  )
}