"use client";

import { useEffect } from "react";
import { Infer } from "@/data/types.base";
import { cn } from "@/lib/utils/cn";
import { useForm } from "react-hook-form";
import ZApp from "@/data/api/app/app.schema";
import useApi from "@/data/hooks/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs } from "@base-ui/react/tabs";
import { SubmitButton, InputBlock, LicenseBlock } from "./components";
import { appStore } from "@/store/app/store";

export default function TabTeacherLisense() {
  const tabs = [
    { label: "Buy Lisense", value: "buy", className: "order-1" },
    { label: "Join School", value: "join", className: "order-3" },
  ];

  return (
    <div className="flex-1">
      <Tabs.Root defaultValue="buy" className="w-full max-w-3xl min-h-96 mx-auto space-y-12 flex flex-col items-center">
        <Tabs.List className="flex-center gap-4">
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              className={cn(
                "text-3xl font-medium text-neutral-400 hover:text-neutral-600 data-selected:text-neutral-900 cursor-pointer outline-none transition-colors",
                tab.className
              )}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
          <p className="text-3xl font-medium text-neutral-300 order-2">
            /
          </p>
        </Tabs.List>

        <BuyLisense />
        <JoinSchool />
      </Tabs.Root>
    </div>
  );
}

const ZBuyForm = ZApp.AppOnboardingPatchLicensing.shape.body;
type IBuyForm = Infer["AppOnboardingPatchLicensing"]["body"];

const TEACHER_LICENSE_OPTIONS = [
  { label: "Educator (Pro)", value: "PRO" },
  { label: "Team (Department)", value: "DEPARTMENT" },
  { label: "School (Enterprise)", value: "ENTERPRISE" },
];

function BuyLisense() {
  const setStep = appStore((state) => state.setOnboardingStep);

  const { data, isLoading } = useApi.query("app:onboarding:get:licensing");
  const { mutate, isPending } = useApi.mutate("app:onboarding:patch:licensing");

  const defaultValues: IBuyForm = {
    workspace: data?.workspace ?? "",
    tier: data?.tier ?? "FREE",
  };

  const { handleSubmit, reset, control } = useForm<IBuyForm>({
    resolver: zodResolver(ZBuyForm),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && data) {
      reset(defaultValues);
    }
  }, [isLoading, data, reset]);

  const submit = (formData: IBuyForm) => {
    mutate(formData, {
      onSuccess: () => {
        setStep("final");
      },
    });
  };

  return (
    <Tabs.Panel
      value="buy"
      render={<form onSubmit={handleSubmit(submit)} />}
      className="w-full space-y-12 flex flex-col items-center"
    >
      <div className="w-full max-w-md space-y-6">
        <InputBlock
          control={control}
          name="workspace"
          label="Workplace"
        />

        <LicenseBlock
          control={control}
          name="tier"
          label="Purchase lisense"
          options={TEACHER_LICENSE_OPTIONS}
        />
      </div>

      <SubmitButton
        label={isPending ? "Saving..." : "Next"}
        disabled={isPending}
        loading={isPending}
      />
    </Tabs.Panel>
  );
}

const ZJoinForm = ZApp.AppOnboardingPatchJoin.shape.body;
type IJoinForm = Infer["AppOnboardingPatchJoin"]["body"];

function JoinSchool() {
  const setStep = appStore((state) => state.setOnboardingStep);
  const { mutate, isPending } = useApi.mutate("app:onboarding:patch:join");

  const { handleSubmit, control } = useForm<IJoinForm>({
    resolver: zodResolver(ZJoinForm),
    defaultValues: {
      schoolId: "",
      joinCode: "",
    },
  });

  const submit = (formData: IJoinForm) => {
    mutate(formData, {
      onSuccess: () => {
        setStep("final");
      },
    });
  };

  return (
    <Tabs.Panel
      value="join"
      render={<form onSubmit={handleSubmit(submit)} />}
      className="w-full space-y-12 flex flex-col items-center"
    >
      <div className="w-full max-w-md space-y-4">
        <InputBlock
          control={control}
          name="schoolId"
          label="School ID"
        />

        <InputBlock
          control={control}
          name="joinCode"
          label="Join Code"
        />
      </div>

      <SubmitButton
        label={isPending ? "Joining..." : "Next"}
        disabled={isPending}
        loading={isPending}
      />
    </Tabs.Panel>
  );
}