"use client";

import { useEffect } from "react";
import { Infer } from "@/data/types.base";
import { useForm } from "react-hook-form";
import ZApp from "@/data/api/app/app.schema";
import useApi from "@/data/hooks/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import StateLoading from "@/components/common/state.loading";
import { SubmitButton, InputBlock, LicenseBlock } from "./components";
import { appStore } from "@/store/app/store";

const ZForm = ZApp.AppOnboardingPatchLicensing.shape.body;
type IForm = Infer["AppOnboardingPatchLicensing"]["body"];

const STUDENT_LICENSE_OPTIONS = [
  { label: "Free Tier", value: "FREE" },
];

export default function TabStudentLisense() {
  const setStep = appStore((state) => state.setOnboardingStep);

  const { data, isLoading } = useApi.query("app:onboarding:get:licensing");
  const { mutate, isPending } = useApi.mutate("app:onboarding:patch:licensing");

  const defaultValues: IForm = {
    workspace: data?.workspace ?? "",
    tier: data?.tier ?? "FREE",
  };

  const { handleSubmit, reset, control } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && data) {
      reset(defaultValues);
    }
  }, [isLoading, data, reset]);

  const submit = (formData: IForm) => {
    mutate(formData, {
      onSuccess: () => {
        setStep("final");
      },
    });
  };

  if (isLoading) {
    return <StateLoading />;
  }

  return (
    <div className="flex-1">
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full max-w-3xl min-h-96 mx-auto space-y-12 flex flex-col items-center"
      >
        <h3 className="text-3xl font-medium text-neutral-700">Lisensing</h3>

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
            options={STUDENT_LICENSE_OPTIONS}
          />
        </div>

        <SubmitButton
          label={isPending ? "Saving..." : "Next"}
          disabled={isPending}
          loading={isPending}
        />
      </form>
    </div>
  );
}
