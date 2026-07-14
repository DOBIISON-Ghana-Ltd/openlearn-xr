"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import useApi from "@/data/hooks/use-api";
import { toastManager } from "@/components/ui/toast";
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogPrimitive, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Infer } from "@/data/types.base";
import ZOrg from "@/data/api/org/org.schema";
import TextBlock from "./form-blocks/text-block";
import { match } from "ts-pattern";
import { QUERY_KEYS } from "@/data/key-factory";

const ZForm = ZOrg.PublicOrgCreate.shape.body;
type IForm = Infer["PublicOrgCreate"]["body"];

const defaultValues: IForm = { name: "" };

export function NewOrganization(props: DialogPrimitive.Root.Props) {
  const queryClient = useQueryClient();
  const closeRef = useRef<() => void>(() => {});

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const { mutate, isPending } = useApi.mutate("public:org:post:create");

  const onSubmit = (data: IForm) => {
    mutate(data, {
      onSuccess: () => {
        toastManager.add({
          type: "success",
          title: "Organization created successfully!"
        });
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS["public:org:get:active"]] });
        reset(defaultValues);
        closeRef.current(); // Call captured DialogClose click handler to close the dialog
      },
      onError: (error: any) => {
        toastManager.add({ title: error.message || "Failed to create organization", type: "error" });
      }
    });
  };

  const onOpenChange = (open: boolean, eventDetails: any) => {
    if (!open) {
      reset(defaultValues);
    }
    props.onOpenChange?.(open, eventDetails);
  };

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogPopup id="new-org-form" render={<form onSubmit={handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
          <DialogDescription>Create a new organization to collaborate with your team.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <TextBlock
            name="name"
            label="Organization Name"
            placeholder="e.g. Acme Corp"
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
                form="new-org-form"
                disabled={isPending}
              >
                {match(isPending)
                  .with(false, () => "Create Organization")
                  .otherwise(() => "Creating")
                }
              </Button>
            );
          }} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
} 