"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ZApp from "@/data/api/app/app.schema";
import TextBlock from "@/components/(new)/form-blocks/text-block";
import PasswordBlock from "@/components/(new)/form-blocks/password-block";
import { Logo } from "@/components/(new)/common/logo";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { toastManager } from "@/components/(new)/common/toast";
import { Loader2Icon } from "lucide-react";
import { match } from "ts-pattern";
import { PATHS } from "@/lib/constants/paths";
import { authClient } from "@/adapters/auth/client";
import getAbsoluteClientUrl from "@/lib/utils/absolute-client-url";

const ZForm = ZApp.AppUserLogin.shape.body;
type IForm = Infer["AppUserLogin"]["body"];

export default function ClientPage() {
  const [params] = nuqs.getStates("app:login");
  const router = useRouter();
  const { mutate: login, isPending } = useApi.mutate("app:user:login");

  const { handleSubmit, control, getValues } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { email: "", password: "" },
  });

  const registerUrl = nuqs.getUrl("app:register", { redirect: params.redirect }, PATHS.AUTH.REGISTER);
  const forgotPasswordUrl = nuqs.getUrl("app:forgot-password", { redirect: params.redirect }, PATHS.AUTH.FORGOT_PASSWORD);

  const handleGoogleLogin = async () => {
    const callbackPath = params.redirect || PATHS.MODULES;
    await authClient.signIn.social({
      provider: "google",
      callbackURL: getAbsoluteClientUrl(callbackPath),
    });
  };

  const onSubmit = (data: IForm) => {
    login({ ...data, redirect: params.redirect }, {
      onSuccess: () => {
        toastManager.add({
          title: "Login successful! Redirecting...",
          type: "success"
        });
      },
      onError: (err) => {
        const msg = err.message?.toLowerCase() ?? "";
        if (msg.includes("verif") || msg.includes("not_verified")) {
          router.push(`${PATHS.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(getValues("email"))}`);
        }
        if (msg.includes("password")) {
          toastManager.add({
            title: "Invalid email or password. Please try again.",
            type: "error"
          });
        }
      },
    });
  };

  return (
    <div className="relative w-full h-dvh min-h-dvh bg-surface-white flex items-center overflow-hidden">

      {/* Left Panel: Hero Graphic */}
      <div className="relative size-full max-w-lg shrink-0 hidden lg:block">
        <div className="absolute top-0 left-0 size-full overflow-hidden">
          <Image
            src="/(new)/bg/image-02.png"
            alt="Open Learn XR Lab"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute right-0 inset-y-0 w-28 bg-linear-to-r from-surface-white/0 via-surface-white/70 to-surface-white pointer-events-none z-10" />
      </div>

      {/* Right Panel: Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 h-full flex-center flex-col p-6 lg:p-12 min-w-0">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

          {/* Logo */}
          <div className="flex justify-center mb-1">
            <Logo className="w-46 h-auto" />
          </div>

          {/* Heading */}
          <h1 className="text-h6 text-primary-text-dark text-center">
            Login
          </h1>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-10 border border-primary-cta/20 rounded-lg flex items-center justify-center gap-2 text-small text-primary-text-dark hover:bg-surface-slate/50 transition-colors cursor-pointer"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Separator */}
          <div className="relative w-full flex items-center justify-center my-0.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-cta/20" />
            </div>
            <div className="relative bg-surface-white px-3 text-caption text-tertiary">
              OR
            </div>
          </div>

          {/* Form Fields */}
          <div className="w-full flex flex-col gap-4">
            <TextBlock
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
            />
            <PasswordBlock
              control={control}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex justify-end -mt-1">
              <Link
                href={forgotPasswordUrl}
                className="text-caption text-primary-cta hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98 mt-1"
            >
              {match(isPending)
                .with(false, () => "Login")
                .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                .exhaustive()}
            </button>
          </div>

          {/* Sign up Link */}
          <p className="text-caption text-tertiary text-center">
            Don&apos;t have an account?{" "}
            <Link
              href={registerUrl}
              className="text-primary-cta font-medium hover:text-primary-hover transition-colors"
            >
              Register
            </Link>
          </p>

        </div>
      </form>
    </div>
  );
}

