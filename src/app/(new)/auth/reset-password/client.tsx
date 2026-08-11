"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ZApp from "@/data/api/app/app.schema";
import PasswordBlock from "@/components/(new)/form-blocks/password-block";
import { Logo } from "@/components/(new)/common/logo";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { PATHS } from "@/lib/constants/paths";
import { toastManager } from "@/components/ui/toast";
import { Loader2Icon } from "lucide-react";
import { match } from "ts-pattern";

const ZForm = ZApp.AppUserResetPassword.shape.body;
type IForm = Infer["AppUserResetPassword"]["body"];

export default function ClientPage() {
  const router = useRouter();
  const [params] = nuqs.getStates("app:reset-password");
  const { mutate: resetPassword, isPending } = useApi.mutate("app:user:reset-password");

  const loginUrl = nuqs.getUrl("app:login", { redirect: params.redirect }, PATHS.AUTH.LOGIN);

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
      onError: () => {
        toastManager.add({
          title: "Failed to reset password. Please try again.",
          type: "error"
        });
      }
    });
  };

  useEffect(() => {
    if (!params.email || !params.otp) {
      const url = nuqs.getUrl("app:forgot-password", { redirect: params.redirect }, PATHS.AUTH.FORGOT_PASSWORD);
      router.replace(url);
    }
  }, [params, router]);

  return (
    <div className="relative w-full h-dvh min-h-dvh bg-surface-white flex items-center overflow-hidden">

      {/* Left Panel: Hero Graphic */}
      <div className="relative size-full max-w-lg shrink-0 hidden lg:block">
        <div className="absolute top-0 left-0 size-full overflow-hidden">
          <Image
            src="/(new)/bg/image-03.png"
            alt="Open Learn XR Lab"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute right-0 inset-y-0 w-28 bg-linear-to-r from-surface-white/0 via-surface-white/70 to-surface-white pointer-events-none z-10" />
      </div>

      {/* Right Panel: Content */}
      <div className="flex-1 h-full flex-center flex-col p-6 lg:p-12 min-w-0">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

          {/* Logo */}
          <div className="flex justify-center mb-1">
            <Logo className="w-46 h-auto" />
          </div>

          {/* Heading */}
          <h1 className="text-h6 text-primary-text-dark text-center">
            Reset Password
          </h1>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <PasswordBlock
              control={control}
              name="newPassword"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <PasswordBlock
              control={control}
              name="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isPending}
              className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98 mt-1"
            >
              {match(isPending)
                .with(false, () => "Reset Password")
                .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                .exhaustive()}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-caption text-tertiary text-center">
            Remember your password?{" "}
            <Link
              href={loginUrl}
              className="text-primary-cta font-medium hover:text-primary-hover transition-colors"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

