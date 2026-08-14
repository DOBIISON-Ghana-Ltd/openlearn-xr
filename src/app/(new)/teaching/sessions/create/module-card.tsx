"use client";

import { useFormContext } from "react-hook-form";
import { Infer } from "@/data/types.base";
import { IFormInput } from "./client";
import CommonModuleCard from "@/components/(new)/common/module-card";

type ModuleCardProps = {
  data: Infer["SesModuleGetOne"]["res"];
  onClick?: () => void;
};

export default function ModuleCard({ data, onClick }: ModuleCardProps) {
  const { watch, setValue } = useFormContext<IFormInput>();
  const selectedModuleId = watch("moduleId");
  const isSelected = selectedModuleId === data.id;

  const handleSelect = () => {
    setValue("moduleId", data.id, { shouldDirty: true, shouldValidate: true });
    onClick?.();
  };

  return (
    <CommonModuleCard
      data={data}
      actionType="select"
      isSelected={isSelected}
      onClick={handleSelect}
    />
  );
}

