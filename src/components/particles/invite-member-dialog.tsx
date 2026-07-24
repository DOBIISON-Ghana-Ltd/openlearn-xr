"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogPrimitive, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Infer } from "@/data/types.base";
import ZApp from "@/data/api/app/app.schema";
import TextBlock from "./form-blocks/text-block";

const ZForm = ZApp.AppOrgInviteMember.shape.body;
type IForm = Infer["AppOrgInviteMember"]["body"];

const defaultValues: IForm = {
  email: "",
  role: "member",
};

export function InviteMemberDialog(props: DialogPrimitive.Root.Props) {
  const closeRef = useRef<() => void>(() => {});

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    // Stub - to be implemented fully later.
    console.log("Inviting member:", data);
    closeRef.current();
  };

  const onOpenChange = (open: boolean, eventDetails: any) => {
    if (!open) {
      reset(defaultValues);
    }
    props.onOpenChange?.(open, eventDetails);
  };

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogPopup id="invite-member-form" render={<form onSubmit={handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Add a new collaborator to this organization.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <TextBlock
            name="email"
            label="Email Address"
            placeholder="colleague@example.com"
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
                form="invite-member-form"
              >
                Send Invitation
              </Button>
            );
          }} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
