"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@base-ui/react";
import { match } from "ts-pattern";
import StateLoading from "@/components/common/state.loading";
import TabGeneral from "./tab.general";
import TabFinal from "./tab.final";
import TabTeacherLisense from "./tab.teacher.lisense";
import TabStudentLisense from "./tab.student.lisense";
import TabStudentDetail from "./tab.student.detail";
import { appStore } from "@/store/app/store";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const currentStep = appStore((state) => state.onboardingStep);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { value: "general", content: TabGeneral },
    { value: "student:detail", content: TabStudentDetail },
    { value: "student:lisense", content: TabStudentLisense },
    { value: "teacher:lisense", content: TabTeacherLisense },
    { value: "final", content: TabFinal },
  ];

  return match(mounted)
    .with(false, () => <StateLoading />)
    .with(true, () => (
      <Tabs.Root value={currentStep} className="h-dvh flex flex-col space-y-14">
        <Header />
        <div className="flex-1 flex flx-col">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.value} value={tab.value} className="flex-1">
              <tab.content />
            </Tabs.Panel>
          ))}
        </div>
      </Tabs.Root>
    ))
    .exhaustive()
};

function Header() {
  // if step;
  // is general , progress is 1
  // is student:detail , progress is 1 and 1/2
  // is student:lisense , progress is 2
  // is teacher:lisense , progress is 2
  // is final , progress is 3

  return (
    <div className="w-full flex-center gap-4 pt-24">
      {[1, 2, 3].map((index) => (
        <div key={index} className="h-2 w-20 rounded-full bg-neutral-100"></div>
      ))}
    </div>
  )
};