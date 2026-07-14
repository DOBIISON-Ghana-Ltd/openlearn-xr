"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Dialog, DialogPopup, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { CrownIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import useApi from "@/data/hooks/use-api";
import { Tabs, TabsContent } from "../ui/tabs";
import OrganizationArea from "./organization-area";
import { ProfileEditCenter } from "./profile-edit-center";
import { ProfileOrgLicenseCenter } from "./profile-org-license-center";
import { ProfileOrgMembersCenter } from "./profile-org-members-center";
import { ProfileOrgPreferencesCenter } from "./profile-org-preferences-center";
import { AVATARS } from "@/lib/constants/avatars";

interface TabButtonProps {
  label: string;
  icon: React.ComponentType<{ strokeWidth?: number; className?: string }>;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon: Icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-1.5 text-xs-m font-normal hover:bg-muted rounded-full tracking-wide",
        { "bg-muted": isActive }
      )}
    >
      <Icon strokeWidth={1.5} className="size-4.5" />
      {label}
    </button>
  );
}

export default function ProfileCenter() {
  const { data } = useApi.query('public:user:get:me');
  const [activeTab, setActiveTab] = useState("Profile");

  if (!data) return null;

  const userTabs = [
    { icon: UserIcon, label: "Profile", content: ProfileEditCenter },
  ];

  const orgTabs = [
    { icon: SettingsIcon, label: "Preferences", content: ProfileOrgPreferencesCenter },
    { icon: UsersIcon, label: "Members", content: ProfileOrgMembersCenter },
    { icon: CrownIcon, label: "License", content: ProfileOrgLicenseCenter },
  ];

  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger render={<TooltipTrigger />} className="group w-full aspect-square flex-center">
          <img
            src={AVATARS[data.image]}
            alt={data.name}
            className="size-9 rounded-full object-cover border border-transparent group-hover:border-border transition-colors"
          />
        </DialogTrigger>
        <TooltipPopup side="right">Profile</TooltipPopup>
      </Tooltip>

      <DialogPopup
        viewportClassName="grid-rows-[1fr_auto_1fr]"
        className="sm:max-w-4xl h-[80dvh] max-h-[80dvh] rounded-sm overflow-hidden"
      >
        <div className="size-full flex items-stretch">
          <div className="bg-muted/20 w-56 h-full border-r flex flex-col">
            <OrganizationArea />
            <ScrollArea className="flex-1 size-full">
              <div className="h-full flex-center flex-col items-start">
                <ul className="py-4 w-full px-2 space-y-1">
                  {userTabs.map((tab) => (
                    <li key={tab.label} className="w-full">
                      <TabButton
                        label={tab.label}
                        icon={tab.icon}
                        isActive={activeTab === tab.label}
                        onClick={() => setActiveTab(tab.label)}
                      />
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 w-full">
                  <p className="text-xs-m capitalize font-medium text-muted-foreground px-4">Organization</p>
                  <ul className="w-full px-2 space-y-1">
                    {orgTabs.map((tab) => (
                      <li key={tab.label} className="w-full">
                        <TabButton
                          label={tab.label}
                          icon={tab.icon}
                          isActive={activeTab === tab.label}
                          onClick={() => setActiveTab(tab.label)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
          <Tabs value={activeTab} className="flex-1 h-full">
            {[...userTabs, ...orgTabs].map(({ label, content: Content }) => (
              <TabsContent key={label} value={label} className="h-full">
                <ScrollArea className="flex-1 h-full">
                  <Content />
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogPopup>
    </Dialog>
  );
}