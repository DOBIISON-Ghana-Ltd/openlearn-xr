"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ZApp from "@/data/api/app/app.schema";
import TextBlock from "@/components/(new)/form-blocks/text-block";
import OtpBlock from "@/components/(new)/form-blocks/otp-block";
import { Logo } from "@/components/(new)/common/logo";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { toastManager } from "@/components/ui/toast";
import { Loader2Icon } from "lucide-react";
import { match } from "ts-pattern";
import { PATHS } from "@/lib/constants/paths";

const ZSendForm = ZApp.AppUserSendOtp.shape.body;
const ZCheckForm = ZApp.AppUserCheckOtp.shape.body;

type ISendForm = Infer["AppUserSendOtp"]["body"];
type ICheckForm = Infer["AppUserCheckOtp"]["body"];

export default function ClientPage() {
  const router = useRouter();
  const [params] = nuqs.getStates("app:forgot-password");
  const [tab, setTab] = useState<"send" | "verify">("send");
  const { mutate: sendOtp, isPending: IPSendOtp } = useApi.mutate("app:user:send-otp");
  const { mutate: checkOtp, isPending: IPCheckOtp } = useApi.mutate("app:user:check-otp");

  const loginUrl = nuqs.getUrl("app:login", { redirect: params.redirect }, PATHS.AUTH.LOGIN);

  const sendForm = useForm<ISendForm>({
    resolver: zodResolver(ZSendForm),
    defaultValues: { email: "", type: "forget-password" },
  });

  const checkForm = useForm<ICheckForm>({
    resolver: zodResolver(ZCheckForm),
    defaultValues: { email: "", type: "forget-password", otp: "" },
  });

  const onSendSubmit = (data: ISendForm) => {
    sendOtp(data, {
      onSuccess: () => {
        checkForm.reset({ email: data.email, type: "forget-password", otp: "" });
        setTab("verify");
        toastManager.add({
          title: "Verification code sent! Please check your email.",
          type: "success"
        });
      },
      onError: () => {
        toastManager.add({
          title: "Failed to send verification code. Please try again.",
          type: "error"
        });
      }
    });
  };

  const onCheckSubmit = (data: ICheckForm) => {
    checkOtp(data, {
      onSuccess: () => {
        const url = nuqs.getUrl("app:reset-password", {
          email: data.email,
          otp: data.otp,
          redirect: params.redirect,
        }, PATHS.AUTH.RESET_PASSWORD);
        router.push(url);
      },
      onError: () => {
        toastManager.add({
          title: "Failed to verify code. Please try again.",
          type: "error"
        });
      }
    });
  };

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

          {match(tab)
            .with("send", () => (
              <>
                <h1 className="text-h6 text-primary-text-dark text-center">
                  Forgot Password?
                </h1>

                <form onSubmit={sendForm.handleSubmit(onSendSubmit)} className="w-full flex flex-col gap-4">
                  <TextBlock
                    control={sendForm.control}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                  <button
                    type="submit"
                    disabled={IPSendOtp}
                    className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98 mt-1"
                  >
                    {match(IPSendOtp)
                      .with(false, () => "Send Verification Code")
                      .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                      .exhaustive()}
                  </button>
                </form>

                <p className="text-caption text-tertiary text-center">
                  Remember your password?{" "}
                  <Link
                    href={loginUrl}
                    className="text-primary-cta font-medium hover:text-primary-hover transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </>
            ))
            .with("verify", () => (
              <>
                <div className="flex flex-col items-center gap-2">
                  <h1 className="text-h6 text-primary-text-dark text-center">
                    Verify Your Code
                  </h1>
                  <p className="text-caption text-tertiary text-center">
                    Enter the verification code sent to{" "}
                    <span className="text-primary-text-dark font-medium">
                      {sendForm.getValues("email")}
                    </span>
                  </p>
                </div>

                <form onSubmit={checkForm.handleSubmit(onCheckSubmit)} className="w-full flex flex-col items-center gap-4">
                  <OtpBlock control={checkForm.control} name="otp" />

                  <button
                    type="submit"
                    disabled={IPCheckOtp}
                    className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98 mt-2"
                  >
                    {match(IPCheckOtp)
                      .with(false, () => "Verify Code")
                      .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                      .exhaustive()}
                  </button>

                  <button
                    type="button"
                    onClick={() => sendForm.handleSubmit(onSendSubmit)()}
                    disabled={IPSendOtp}
                    className="text-caption text-primary-cta hover:text-primary-hover font-medium transition-colors cursor-pointer"
                  >
                    {IPSendOtp ? "Resending code..." : "Resend code"}
                  </button>
                </form>

                <p className="text-caption text-tertiary text-center">
                  Remember your password?{" "}
                  <Link
                    href={loginUrl}
                    className="text-primary-cta font-medium hover:text-primary-hover transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </>
            ))
            .exhaustive()}

        </div>
      </div>
    </div>
  );
}

