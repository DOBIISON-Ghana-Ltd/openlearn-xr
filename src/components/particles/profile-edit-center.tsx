"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import AvatarBlock from "./form-blocks/avatar-block";
import TextBlock from "./form-blocks/text-block";
import Password from "./form-blocks/password-block";
import useApi from "@/data/hooks/use-api";
import ZUser from "@/data/api/user/user.schema";
import { Infer } from "@/data/types.base";
import { toastManager } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";

export function ProfileEditCenter() {
  return (
    <div className="flex flex-col">
      <div className="py-6 px-4">
        <h4 className="text-xl font-normal text-foreground">Edit Profile</h4>
      </div>
      <div className="px-4 space-y-8 pb-8">
        <EditAccount />
        <Security />
      </div>
    </div>
  );
}

const ZFormAccount = ZUser.PublicUserUpdateAccount.shape.body;
type IFormAccount = Infer["PublicUserUpdateAccount"]["body"];

function EditAccount() {
  const { data: me } = useApi.query("public:user:get:me");
  const { mutate: updateAccount, isPending } = useApi.mutate("public:user:update-account");
  const queryClient = useQueryClient();

  const defaultValues: IFormAccount = {
    name: me?.name || "",
    image: me?.image || "avatar-01",
    email: me?.email || "",
  };

  const { handleSubmit, control, reset, formState: { isDirty } } = useForm<IFormAccount>({
    resolver: zodResolver(ZFormAccount),
    defaultValues,
  });

  useEffect(() => {
    if (me) {
      reset(defaultValues);
    }
  }, [me, reset]);

  const onSubmit = (data: IFormAccount) => {
    updateAccount(data, {
      onSuccess: () => {
        toastManager.add({ type: "success", title: "Account updated successfully!" });
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS["public:users:get:me"]],
        });
      },
      onError: (err: any) => {
        toastManager.add({ type: "error", title: err.message || "Failed to update account" });
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">Account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <AvatarBlock label="Avatar URL" control={control} name="image" placeholder="https://example.com/avatar.png" />
        <TextBlock label="User Name" control={control} name="name" placeholder="Name" />
        <TextBlock label="Email" control={control} name="email" placeholder="Email" disabled />

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
  );
}

const ZFormPassword = ZUser.PublicUserUpdatePassword.shape.body;
type IFormPassword = Infer["PublicUserUpdatePassword"]["body"];

const defaultPasswordValues: IFormPassword = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function Security() {
  const { mutate: updatePassword, isPending } = useApi.mutate("public:user:update-password");

  const { handleSubmit, control, reset, formState: { isDirty } } = useForm<IFormPassword>({
    resolver: zodResolver(ZFormPassword),
    defaultValues: defaultPasswordValues,
  });

  const onSubmit = (data: IFormPassword) => {
    updatePassword(data, {
      onSuccess: () => {
        toastManager.add({ type: "success", title: "Password updated successfully!" });
        reset(defaultPasswordValues);
      },
      onError: (err: any) => {
        toastManager.add({ type: "error", title: err.message || "Failed to update password" });
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">Security</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Password label="Old Password" control={control} name="oldPassword" placeholder="••••••••" />
        <Password label="New Password" control={control} name="newPassword" placeholder="••••••••" />
        <Password label="Confirm New Password" control={control} name="confirmNewPassword" placeholder="••••••••" />

        <div className="flex items-center justify-end gap-2 pt-2">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reset(defaultPasswordValues)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || isPending}
          >
            {isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}