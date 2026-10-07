"use client";

import { useEffect } from "react";
import { Infer } from "@/data/types.base";
import { useForm } from "react-hook-form";
import ZApp from "@/data/api/app/app.schema";
import useApi from "@/data/hooks/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import StateLoading from "@/components/common/state.loading";
import { SubmitButton, InputBlock, PhoneBlock, SelectBlock } from "./components";
import { appStore } from "@/store/app/store";

const ZForm = ZApp.AppOnboardingPatchDetail.shape.body;
type IForm = Infer["AppOnboardingPatchDetail"]["body"];

const CLASS_LEVEL_OPTIONS = [
  { label: "SHS 1", value: "SHS 1" },
  { label: "SHS 2", value: "SHS 2" },
  { label: "SHS 3", value: "SHS 3" },
];

export default function TabStudentDetail() {
  const setStep = appStore((state) => state.setOnboardingStep);

  const { data, isLoading } = useApi.query("app:onboarding:get:detail");
  const { mutate, isPending } = useApi.mutate("app:onboarding:patch:detail");

  const defaultValues: IForm = {
    school: data?.school ?? "",
    classLevel: data?.classLevel ?? "SHS 1",
    location: data?.location ?? "",
    phone: data?.phone ?? "",
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
        setStep("student:lisense");
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
        className="w-full max-w-3xl mx-auto space-y-12 flex flex-col items-center"
      >
        <h3 className="text-3xl font-medium text-neutral-700">Extra Details</h3>

        <div className="w-full max-w-md space-y-4">
          <InputBlock
            control={control}
            name="school"
            label="School"
          />

          <SelectBlock
            control={control}
            name="classLevel"
            label="Grade"
            options={CLASS_LEVEL_OPTIONS}
            placeholder="Select your grade"
          />

          <InputBlock
            control={control}
            name="location"
            label="Location"
          />

          <PhoneBlock
            control={control}
            name="phone"
            label="Telephone"
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
