"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import ZSes from "@/data/api/ses/ses.schema";
import TextBlock from "./form-blocks/text-block";
import ComboboxBlock from "./form-blocks/combobox-block";
import useApi from "@/data/hooks/use-api";
import { nuqs } from "@/lib/utils/nuqs";

const ZForm = ZSes.SesSessionPostCreate.shape.body;
type IForm = Infer["SesSessionPostCreate"]["body"];

const defaultValues: IForm = {
  name: "",
  moduleVersionId: "",
};

type INewSession = Pick<DialogPrimitive.Root.Props, "handle">;

export default function NewSessionDialog(props: INewSession) {
  const router = useRouter();
  const closeRef = useRef<() => void>(() => { });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = nuqs.getStates("ses:dashboard");

  const { data: moduleVersions } = useApi.query("ses:module-version:get:options");
  const { mutate: createSession, isPending } = useApi.mutate("ses:session:post:create");

  const moduleItems = (moduleVersions ?? []).map((v) => ({
    label: `${v.module.title} #v${v.versionNumber}`,
    value: v.id,
  }));

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    createSession(data, {
      onSuccess: (res) => {
        closeRef.current();
        router.push(`/app/session/${res.id}`);
      },
    });
  };

  // Sync open state and prefill form when query triggers auto-open
  useEffect(() => {
    if (query.new === "true") {
      setOpen(true);
    }
  }, [query.new]);

  // Handle auto-populating moduleVersionId from query parameters (where query.moduleId is the moduleVersionId)
  useEffect(() => {
    if (moduleVersions && query.moduleId) {
      const matched = moduleVersions.find((v) => v.id === query.moduleId);
      if (matched) {
        reset({
          name: "",
          moduleVersionId: matched.id,
        });
      }
    }
  }, [query.moduleId, moduleVersions, reset]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(defaultValues);
      setQuery({ new: null, moduleId: null });
    }
  };

  return (
    <Dialog handle={props.handle} open={open} onOpenChange={onOpenChange}>
      <DialogPopup id="new-session-form" render={<form onSubmit={handleSubmit(onSubmit)} />}>
        <DialogHeader>
          <DialogTitle>Start a Session</DialogTitle>
          <DialogDescription>Give the session a name and pick the module to run.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <TextBlock
            name="name"
            label="Session Name"
            placeholder="e.g. Cohort A — Week 3"
            control={control}
          />
          <ComboboxBlock
            name="moduleVersionId"
            label="Module Version"
            placeholder="Search modules…"
            items={moduleItems}
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
                form="new-session-form"
                disabled={isPending}
              >
                {isPending ? "Creating…" : "Start Session"}
              </Button>
            );
          }} />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}