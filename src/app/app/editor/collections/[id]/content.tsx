"use client";

import { Button } from "@/components/ui/button";
import { Input, InputPrimitive } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { GripHorizontalIcon, LoaderIcon, SquarePenIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { match } from "ts-pattern";
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import ZModules from "@/data/api/modules/modules.schema";

interface ClientPageProps {
  collectionId: string;
}

const ZForm = ZModules.AdminCollectionPatchDetails.shape.body;
type IForm = Infer["AdminCollectionPatchDetails"]["body"];

export default function Content({ collectionId }: ClientPageProps) {
  const [isNameView, setIsNameView] = useState(true);
  const [isDescView, setIsDescView] = useState(true);
  const { mutate, isPending } = useApi.mutate("admin:collection:patch:details");

  const defaultValues: IForm = {
    name: "",
    description: "",
  };
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const submit = (data: IForm) => {
    mutate({
      params: { id: collectionId },
      body: data
    }, {
      onSuccess: () => {

      }
    })
  }

  return (
    <div className="flex-1">
      {/* TOP SECTION */}
      <div className="w-full px-5 py-9 space-y-2">
        <h1 className="text-xl font-normal text-foreground">
          Chemistry Book One
        </h1>
        <p className="text-base font-normal text-foreground tracking-wide max-w-5xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, quam? Sed soluta quaerat debitis quas. Eius, commodi illum. Sunt sapiente fuga consectetur delectus labore voluptatum aspernatur eum aut expedita doloremque?
        </p>
      </div>

      {/* MODULES CONTENT */}
      <ModuleSection />
    </div>
  );
};

function ModuleSection() {
  return (
    <div className="w-full px-5 space-y-1">
      <div className="flex bg-blue-50">
        <p className="text-sm-m text-muted-foreground font-medium">
          Modules
        </p>
      </div>
      <div className="">

      </div>
    </div>
  )
}

function ModuleCard() {
  return (
    <div className="flex gap-2 py-1">
      <div className="h-full flex-center">
        <GripHorizontalIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex-center justify-start h-14 border">

      </div>
    </div>
  )
}
