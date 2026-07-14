"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Dialog, DialogPopup, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { CircleUserRoundIcon, CrownIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import useApi from "@/data/hooks/use-api";
import { Tabs, TabsContent } from "../ui/tabs";
import OrganizationArea from "./organization-area";

export default function ProfileCenter() {
  const { data } = useApi.query('public:user:get:me');
  const [activeTab, setActiveTab] = useState("Profile");

  if (!data) return null;

  const userTabs = [
    { icon: UserIcon, label: "Profile" },
  ];

  const orgTabs = [
    { icon: SettingsIcon, label: "Preferences" },
    { icon: UsersIcon, label: "Members" },
    { icon: CrownIcon, label: "License" },
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
            <OrganizationArea />
            <ScrollArea className="flex-1 size-full">
              <div className="h-full flex-center flex-col items-start">
                <ul className="py-4 w-full px-2 space-y-1">
                  {userTabs.map((tab, index) => (
                    <li key={index} className="w-full">
                      <button
                        onClick={() => setActiveTab(tab.label)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide",
                          { "bg-muted": activeTab === tab.label }
                        )}
                      >
                        <tab.icon strokeWidth={1.5} className="size-4.5" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 w-full">
                  <p className="text-xs-m capitalize font-medium text-muted-foreground px-4">Organization</p>
                  <ul className="w-full px-2 space-y-1">
                    {orgTabs.map((tab) => (
                      <li key={tab.label} className="w-full">
                        <button
                          onClick={() => setActiveTab(tab.label)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide",
                            { "bg-muted": activeTab === tab.label }
                          )}
                        >
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
          <Tabs value={activeTab} className="flex-1 h-full">
            <TabsContent value="Profile" className="h-full m-0 border-none outline-none data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 h-full p-6">
                this is for profile text in them
              </ScrollArea>
            </TabsContent>

            <TabsContent value="Preferences" className="h-full m-0 border-none outline-none data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 h-full p-6">
                this is for preferences text in them
              </ScrollArea>
            </TabsContent>

            <TabsContent value="Members" className="h-full m-0 border-none outline-none data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 h-full p-6">
                this is for members text in them
              </ScrollArea>
            </TabsContent>

            <TabsContent value="License" className="h-full m-0 border-none outline-none data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 h-full p-6">
                this is for license text in them
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogPopup>
    </Dialog>
  )
};