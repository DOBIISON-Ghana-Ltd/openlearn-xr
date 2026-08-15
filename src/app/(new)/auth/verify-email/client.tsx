"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Infer } from "@/data/types.base";
import ZApp from "@/data/api/app/app.schema";
import { Logo } from "@/components/(new)/common/logo";
import OtpBlock from "@/components/(new)/form-blocks/otp-block";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { PATHS } from "@/lib/constants/paths";
import { toastManager } from "@/components/(new)/common/toast";
import { Loader2Icon } from "lucide-react";
import { match } from "ts-pattern";

const ZForm = ZApp.AppUserVerifyEmailOtp.shape.body;
type IForm = Infer["AppUserVerifyEmailOtp"]["body"];

export default function ClientPage() {
  const [params] = nuqs.getStates("app:verify-email");
  const router = useRouter();

  const { mutate: verifyOtp, isPending: IPVerify } = useApi.mutate("app:user:verify-email-otp");
  const { mutate: resendOtp, isPending: IPResend } = useApi.mutate("app:user:send-otp");

  const { handleSubmit, control, reset } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { email: params.email || "", otp: "" },
  });

  const onSubmit = (data: IForm) => {
    verifyOtp(data, {
      onSuccess: () => {
        const url = nuqs.getUrl("app:login", { redirect: params.redirect }, PATHS.AUTH.LOGIN);
        router.replace(url);
      },
      onError: () => {
        toastManager.add({
          title: "Verification failed. Please try again.",
          type: "error"
        });
      }
    });
  };

  const handleResend = () => {
    resendOtp({ email: params.email, type: "email-verification" }, {
      onSuccess: () => reset({ email: params.email, otp: "" }),
      onError: () => {
        toastManager.add({
          title: "Failed to resend verification code. Please try again.",
          type: "error"
        });
      }
    });
  };

  useEffect(() => {
    if (!params.email) {
      const url = nuqs.getUrl("app:login", { redirect: params.redirect }, PATHS.AUTH.LOGIN);
      router.replace(url);
    }
  }, [params, router]);

  return (
    <div className="relative w-full h-dvh min-h-dvh bg-surface-white flex items-center overflow-hidden">

      {/* Left Panel: Hero Graphic */}
      <div className="relative size-full max-w-lg shrink-0 hidden lg:block">
        <div className="absolute top-0 left-0 size-full overflow-hidden">
          <Image
            src="/(new)/bg/image-04.png"
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

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-h6 text-primary-text-dark text-center">
              Verify Your Email
            </h1>
            {params.email && (
              <p className="text-caption text-tertiary text-center">
                Enter the verification code sent to{" "}
                <span className="text-primary-text-dark font-medium">
                  {params.email}
                </span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-4">
            <OtpBlock control={control} name="otp" />

            <button
              type="submit"
              disabled={IPVerify}
              className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98 mt-2"
            >
              {match(IPVerify)
                .with(false, () => "Verify Email")
                .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                .exhaustive()}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={IPResend}
              className="text-caption text-primary-cta hover:text-primary-hover font-medium transition-colors cursor-pointer"
            >
              {IPResend ? "Resending code..." : "Resend code"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-caption text-tertiary text-center">
            Back to{" "}
            <Link
              href={PATHS.AUTH.LOGIN}
              className="text-primary-cta font-medium hover:text-primary-hover transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}


