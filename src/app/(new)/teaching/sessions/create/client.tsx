'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from "react-hook-form";
import { Tabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils/cn';
import Header from '@/components/(new)/common/header';
import SelectTab from './tab.select';
import ConfigureTab from './tab.configure';
import SuccessTab from './tab.success';
import { z } from "zod";
import ZSes from "@/data/api/ses/ses.schema";
import useApi from "@/data/hooks/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { match } from 'ts-pattern';
import { joinCode } from '@/lib/utils/generate-join-code';
import { generateSessionName } from '@/lib/utils/generate-session-name';
import { PATHS } from '@/lib/constants/paths';

const TAB_FLOW = [
  { title: 'Create a Session', render: SelectTab, nextLabel: "Next" },
  { title: 'Configure Session', render: ConfigureTab, nextLabel: "Next" },
  { title: 'Share Session Code', render: SuccessTab, nextLabel: "Go to waiting room" },
];

const ZForm = ZSes.SesSessionPostCreate.shape.body;
export type IFormInput = z.input<typeof ZForm>;
export type IFormOutput = z.output<typeof ZForm>;

export default function ClientPage() {
  const router = useRouter();
  const { mutate: createSession, isPending } = useApi.mutate("ses:session:post:create");
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = TAB_FLOW[tabIndex];

  const defaultValues: IFormInput = {
    name: generateSessionName(),
    joinCode: joinCode.generate(),
    moduleId: "",
    config: {
      allowHints: true,
      allowLateAdmissions: true,
      controlMode: "self-paced",
      maxAdmissions: 50
    }
  };

  const form = useForm<IFormInput, any, IFormOutput>({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const { handleSubmit, control, reset, watch, getValues, formState } = form;
  const moduleId = watch("moduleId");

  const isDisabled = match(tabIndex)
    .with(0, () => !moduleId || Boolean(formState.errors.moduleId))
    .with(1, () => Boolean(formState.errors.config))
    .with(2, () => false)
    .otherwise(() => false);

  const onSubmit = (data: IFormOutput) => {
    createSession(data, {
      onSuccess: () => {
        setTabIndex(2);
      },
    });
  };

  const handleSelectSubmit = () => {
    if (watch("moduleId")) {
      setTabIndex(1);
    }
  };

  const handleConfigSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const handleSuccessSubmit = () => {
    const currentJoinCode = getValues("joinCode");
    router.push(PATHS.TEACHING.SESSIONS.DETAIL(currentJoinCode));
  };

  const handleNext = () => {
    match(tabIndex)
      .with(0, () => handleSelectSubmit())
      .with(1, () => handleConfigSubmit())
      .with(2, () => handleSuccessSubmit())
      .otherwise(() => { });
  };

  return (
    <FormProvider {...form}>
      <Header />
      <Tabs.Root
        value={tabIndex}
        onValueChange={setTabIndex}
        className="relative min-h-[calc(100dvh-var(--spacing)*20)] flex flex-col bg-surface-slate"
      >
        <div className="sticky left-0 top-20 z-10 bg-surface-slate px-8 py-3.5 flex items-center justify-between shrink-0 h-[47px]">
          <h1 className="text-h6 text-secondary-text">
            {activeTab.title}
          </h1>
          <span className="text-h6 text-secondary-text">
            {`${tabIndex + 1} of ${TAB_FLOW.length}`}
          </span>
        </div>

        {/* RED ROW 2: MAIN CONTENT TAKING FLEX-1 WITH WHITE BACKGROUND */}
        <div className="relative z-0 flex-1 flex flex-col min-h-0 bg-surface-white">
          {TAB_FLOW.map((content, index) => (
            <Tabs.Panel key={index} value={index} className="flex-1 flex flex-col min-h-0 bg-surface-white">
              <content.render />
            </Tabs.Panel>
          ))}
        </div>

        {/* RED ROW 3: PARENT STICKY BOTTOM CONTROL BAR */}
        <div className="sticky bottom-0 bg-surface-slate py-3 px-8 flex-center justify-end z-10 shrink-0 h-16">
          <button
            type="button"
            onClick={handleNext}
            disabled={isDisabled || isPending}
            className={cn(
              "bg-primary-cta hover:bg-primary-hover text-button min-w-25 text-primary-light h-10 px-7 rounded-lg transition-all cursor-pointer active:scale-98 flex-center",
              { "opacity-50 pointer-events-none": isDisabled || isPending }
            )}
          >
            {isPending ? 'Creating...' : activeTab.nextLabel}
          </button>
        </div>
      </Tabs.Root>
    </FormProvider>
  );
};