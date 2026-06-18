"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Infer } from "@/data/types.base";
import ZUser from "@/data/modules/user/user.schema";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { ROUTES } from "@/lib/constants/routes";
import { toastManager } from "@/components/ui/toast";
import PasswordBlock from "@/components/auth/form-blocks/password-block";
import { LoaderIcon } from "lucide-react";

const ZForm = ZUser.PublicUserResetPassword.shape.body;
type IForm = Infer["PublicUserResetPassword"]["body"];

export default function ClientPage() {
  const router = useRouter();
  const [params] = nuqs.getStates("resetPassword");
  const { mutate: resetPassword, isPending } = useApi.mutate("public:user:reset-password");

  const loginUrl = nuqs.getUrl("login", { redirect: params.redirect }, ROUTES.LOGIN);

  const { handleSubmit, control } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: {
      email: params.email || "",
      otp: params.otp || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: IForm) => {
    resetPassword(data, {
      onSuccess: () => {
        router.replace(loginUrl);
        toastManager.add({
          title: "Password reset successful! Please log in with your new password.",
          type: "success"
        });
      },
      onError: (err) => {
        toastManager.add({
          title: "Failed to reset password. Please try again.",
          type: "error"
        });
      }
    });
  };

  useEffect(() => {
    if (!params.email || !params.otp) {
      const url = nuqs.getUrl("forgotPassword", { redirect: params.redirect }, ROUTES.FORGOT_PASSWORD);
      router.replace(url);
    }
  }, [params, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-center text-xl font-medium tracking-tight">Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <PasswordBlock control={control} name="newPassword" placeholder="Enter new password" autoComplete="new-password" />
        <PasswordBlock control={control} name="confirmPassword" placeholder="Confirm new password" autoComplete="new-password" />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin size-4" /> : "Reset Password"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={loginUrl}
          className="underline text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Login
        </Link>
      </p>
    </div>
  );
}