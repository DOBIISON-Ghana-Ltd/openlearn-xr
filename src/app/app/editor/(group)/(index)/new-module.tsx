"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogPrimitive,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Infer } from "@/data/types.base";
import ZModules from "@/data/api/modules/modules.schema";
import TextBlock from "@/components/particles/form-blocks/text-block";
import ComboboxBlock from "@/components/particles/form-blocks/combobox-block";
import useApi from "@/data/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";

const ZForm = ZModules.PublicModuleCreate.shape.body;
type IForm = Infer["PublicModuleCreate"]["body"];

const defaultValues: IForm = {
  title: "",
  collectionId: "",
  topicId: "",
};

type INewModule = Pick<DialogPrimitive.Root.Props, "handle">;

export default function NewModuleDialog(props: INewModule) {
  const closeRef = useRef<() => void>(() => {});
  const queryClient = useQueryClient();

  const { data: collections } = useApi.query("public:collection:get:all");
  const { mutate: createModule, isPending } = useApi.mutate("public:module:post:create");

  const collectionItems = (collections ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    createModule(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS["public:module:get:all"]] });
        reset(defaultValues);
        closeRef.current();
      },
    });
  };

  return (
    <Dialog handle={props.handle}>
      <DialogPopup id="new-module-form" render={<form onSubmit={handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Create a Module</DialogTitle>
          <DialogDescription>Enter a module title and select the target collection.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <TextBlock
            name="title"
            label="Module Title"
            placeholder="e.g. Locating Images in a Plane Mirror"
            control={control}
          />
          <ComboboxBlock
            name="collectionId"
            label="Collection"
            placeholder="Search collections…"
            items={collectionItems}
            control={control}
          />
          <TextBlock
            name="topicId"
            label="Topic ID (Optional)"
            placeholder="e.g. topic-reflection-01"
            control={control}
          />
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={(closeProps) => {
            const { onClick, ...rest } = closeProps;
            closeRef.current = () => onClick?.({} as any);
            return (
              <Button
                {...rest}
                type="submit"
                form="new-module-form"
                disabled={isPending}
              >
                {isPending ? "Creating…" : "Create Module"}
              </Button>
            );
          }} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
