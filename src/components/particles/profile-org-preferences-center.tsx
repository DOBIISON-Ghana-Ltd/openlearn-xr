"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import TextBlock from "./form-blocks/text-block";
import useApi from "@/data/hooks/use-api";
import ZOrg from "@/data/api/org/org.schema";
import { Infer } from "@/data/types.base";
import { toastManager } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";

const ZFormPreferences = ZOrg.PublicOrgUpdateActive.shape.body;
type IFormPreferences = Infer["PublicOrgUpdateActive"]["body"];

export function ProfileOrgPreferencesCenter() {
  const { data: activeOrg } = useApi.query("public:org:get:active");
  const { mutate: updateOrg, isPending } = useApi.mutate("public:org:update-active");
  const queryClient = useQueryClient();

  const defaultValues: IFormPreferences = {
    name: activeOrg?.name || "",
    logo: activeOrg?.logo || "org-01",
  };

  const { handleSubmit, control, reset, formState: { isDirty } } = useForm<IFormPreferences>({
    resolver: zodResolver(ZFormPreferences),
    defaultValues,
  });

  useEffect(() => {
    if (activeOrg) {
      reset({
        name: activeOrg.name,
        logo: activeOrg.logo,
      });
    }
  }, [activeOrg, reset]);

  const onSubmit = (data: IFormPreferences) => {
    updateOrg(data, {
      onSuccess: () => {
        toastManager.add({ type: "success", title: "Organization updated successfully!" });
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS["public:org:get:active"]],
        });
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS["public:org:get:all"]],
        });
      },
      onError: (err: any) => {
        toastManager.add({ type: "error", title: err.message || "Failed to update organization" });
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="py-6 px-4">
        <h4 className="text-xl font-normal text-foreground">Preferences</h4>
        <p className="text-sm text-muted-foreground">Manage your organization&apos;s general preferences, name, and branding logo.</p>
      </div>
      <div className="px-4 max-w-md pb-8">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextBlock label="Workspace Name" control={control} name="name" placeholder="Organization Name" />
          <TextBlock label="Workspace Logo" control={control} name="logo" placeholder="org-01" />

          <div className="flex items-center justify-end gap-2 pt-2">
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => reset(defaultValues)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!isDirty || isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}