"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Infer } from "@/data/types.base";
import ZUser from "@/data/modules/user/user.schema";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { ROUTES } from "@/lib/constants/routes";
import { toastManager } from "@/components/ui/toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LoaderIcon } from "lucide-react";

const ZForm = ZUser.PublicUserVerifyEmail.shape.body;
type IForm = Infer["PublicUserVerifyEmail"]["body"];

export default function ClientPage() {
  const [params] = nuqs.getStates("verifyEmail");
  const router = useRouter();

  const { mutate: verifyOtp, isPending: IPVerify } = useApi.mutate("public:user:verify-email-otp");
  const { mutate: resendOtp, isPending: IPResend } = useApi.mutate("public:user:send-otp");

  const { handleSubmit, control, reset } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { email: params.email || "a@gmail.com", otp: "" },
  });

  const otpControl = useController({ control, name: "otp" });

  const onSubmit = (data: IForm) => {
    verifyOtp(data, {
      onSuccess: () => {
        const url = nuqs.getUrl("login", { redirect: params.redirect }, ROUTES.LOGIN);
        router.replace(url);
      },
      onError: (err) => {
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
      onError: (err) => {
        toastManager.add({
          title: "Failed to resend verification code. Please try again.",
          type: "error"
        });
      }
    });
  };

  useEffect(() => {
    if (!params.email) {
      const url = nuqs.getUrl("login", { redirect: params.redirect }, ROUTES.LOGIN);
      router.replace(url);
    }
  }, [params, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium tracking-tight text-center">Verify Your Email</h1>

      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          maxLength={6}
          value={otpControl.field.value}
          onChange={(value) => otpControl.field.onChange(value)}
          containerClassName="w-full justify-between"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPGroup key={i} className="*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:text-lg">
              <InputOTPSlot index={i} />
            </InputOTPGroup>
          ))}
        </InputOTP>

        <Button className="w-full" disabled={IPVerify} onClick={handleSubmit(onSubmit)}>
          {IPVerify ? <LoaderIcon className="animate-spin size-2.5" /> : "Verify Email"}
        </Button>

        <Button type="button" onClick={handleResend} disabled={IPResend} variant="link">
          {IPResend ? <LoaderIcon className="animate-spin size-2.5" /> : "Resend code"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href={ROUTES.LOGIN} className="underline text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
