"use client";

import { useEffect } from "react";
import { Infer } from "@/data/types.base";
import { CheckIcon } from "lucide-react";
import { useController, useForm } from "react-hook-form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import ZApp from "@/data/api/app/app.schema";
import useApi from "@/data/hooks/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import StateLoading from "@/components/common/state.loading";
import { SubmitButton, WithLabel } from "./components";
import { appStore } from "@/store/app/store";

const ZForm = ZApp.AppOnboardingPatchType.shape.body;
type IForm = Infer["AppOnboardingPatchType"]["body"];

export default function TabGeneral() {
  const setStep = appStore((state) => state.setOnboardingStep);

  const { data, isLoading } = useApi.query("app:onboarding:get:type");
  const { mutate, isPending } = useApi.mutate("app:onboarding:patch:type");

  const options = [
    { label: "Student", value: "student" as const },
    { label: "Teacher", value: "teacher" as const },
  ];

  const defaultValues: IForm = {
    type: data?.type || "student",
  };

  const { handleSubmit, reset, control } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const { field } = useController({ name: "type", control });

  useEffect(() => {
    if (!isLoading && data?.type) {
      reset({ type: data.type });
    }
  }, [isLoading, data, reset]);

  const submit = (formData: IForm) => {
    mutate(formData, {
      onSuccess: () => {
        if (formData.type === "student") {
          setStep("student:detail");
        } else {
          setStep("teacher:lisense");
        }
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
        <h3 className="text-3xl font-medium text-neutral-700">What are you?</h3>

        <div className="w-full max-w-md">
          <WithLabel label="Category">
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="w-full flex-center gap-8"
            >
              {options.map((option) => (
                <RadioOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </WithLabel>
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

type IRadioOption = {
  value: string;
  label: string;
};

function RadioOption(props: IRadioOption) {
  const { value, label } = props;

  return (
    <Radio.Root
      value={value}
      className="relative flex-1 flex-center h-16 border border-neutral-300 hover:bg-neutral-100 rounded-lg p-4 cursor-pointer transition-colors outline-none data-checked:bg-neutral-100 data-checked:border-neutral-900"
    >
      <div className="absolute top-2 right-2 size-5 flex-center border border-neutral-300 bg-white rounded-full overflow-hidden">
        <Radio.Indicator className="size-full flex-center bg-neutral-800 rounded-full">
          <CheckIcon className="size-3.5 stroke-2 text-neutral-50" />
        </Radio.Indicator>
      </div>
      <span className="text-base font-normal text-neutral-900">{label}</span>
    </Radio.Root>
  );
}