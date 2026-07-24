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
import ZEditor from "@/data/api/editor/editor.schema";
import TextBlock from "@/components/particles/form-blocks/text-block";
import useApi from "@/data/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";

const ZForm = ZEditor.EditorCollectionPostCreate.shape.body;
type IForm = Infer["EditorCollectionPostCreate"]["body"];

const defaultValues: IForm = {
  name: "",
  description: "",
};

type INewCollection = Pick<DialogPrimitive.Root.Props, "handle">;

export default function NewCollectionDialog(props: INewCollection) {
  const closeRef = useRef<() => void>(() => {});
  const queryClient = useQueryClient();

  const { mutate: createCollection, isPending } = useApi.mutate("editor:collection:post:create");

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    createCollection(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS["editor:collection:get:all"]] });
        reset(defaultValues);
        closeRef.current();
      },
    });
  };

  return (
    <Dialog handle={props.handle}>
      <DialogPopup id="new-collection-form" render={<form onSubmit={handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Create a Collection</DialogTitle>
          <DialogDescription>Enter a name and description for your new collection.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <TextBlock
            name="name"
            label="Collection Name"
            placeholder="e.g. Physics Book One"
            control={control}
          />
          <TextBlock
            name="description"
            label="Description"
            placeholder="e.g. Fundamental physics simulations and practicals"
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
                form="new-collection-form"
                disabled={isPending}
              >
                {isPending ? "Creating…" : "Create Collection"}
              </Button>
            );
          }} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
