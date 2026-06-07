"use client";

import { useState } from "react";
import Link from "next/link";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ZUser from "@/data/modules/user/user.schema";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { ROUTES } from "@/lib/constants/routes";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TextBlock from "@/components/auth/form-blocks/text-block";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Infer } from "@/data/types.base";
import { LoaderIcon } from "lucide-react";

const ZSendForm = ZUser.PublicUserSendOtp.shape.body;
const ZCheckForm = ZUser.PublicUserCheckOtp.shape.body;

type ISendForm = Infer["PublicUserSendOtp"]["body"];
type ICheckForm = Infer["PublicUserCheckOtp"]["body"];

export default function ClientPage() {
  const router = useRouter();
  const [params] = nuqs.getStates("forgotPassword");
  const [tab, setTab] = useState("send");
  const { mutate: sendOtp, isPending: IPSendOtp } = useApi.mutate("public:user:send-otp");
  const { mutate: checkOtp, isPending: IPCheckOtp } = useApi.mutate("public:user:check-otp");

  const loginUrl = nuqs.getUrl("login", { redirect: params.redirect }, ROUTES.LOGIN);

  const sendForm = useForm<ISendForm>({
    resolver: zodResolver(ZSendForm),
    defaultValues: { email: "", type: "forget-password" },
  });

  const checkForm = useForm<ICheckForm>({
    resolver: zodResolver(ZCheckForm),
    defaultValues: { email: "", type: "forget-password", otp: "" },
  });

  const otpControl = useController({ control: checkForm.control, name: "otp" });

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
      onError: (err) => {
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
        const url = nuqs.getUrl("resetPassword", {
          email: data.email,
          otp: data.otp,
          redirect: params.redirect,
        }, ROUTES.RESET_PASSWORD);
        router.push(url);
      },
      onError: (err) => {
        toastManager.add({
          title: "Failed to verify code. Please try again.",
          type: "error"
        });
      }
    });
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      {/* Send OTP tab */}
      <TabsContent value="send" className="space-y-6">
        <h1 className="text-xl font-medium tracking-tight text-center">Reset Your Password</h1>

        <form onSubmit={sendForm.handleSubmit(onSendSubmit)} className="space-y-3">
          <TextBlock control={sendForm.control} name="email" type="email" placeholder="Enter your email" autoComplete="email" />

          <Button type="submit" className="w-full" disabled={IPSendOtp}>
            {IPSendOtp ? <LoaderIcon className="animate-spin size-2.5" /> : "Send Verification Code"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href={loginUrl} className="underline underline-offset-4 text-primary hover:text-primary/80 font-medium transition-colors">
            Login
          </Link>
        </p>
      </TabsContent>

      {/* Verify OTP tab */}
      <TabsContent value="verify" className="space-y-6">
        <h1 className="text-xl font-medium tracking-tight text-center">Verify Your Code</h1>

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

          <Button
            className="w-full"
            disabled={IPCheckOtp}
            onClick={checkForm.handleSubmit(onCheckSubmit)}
          >
            {IPCheckOtp ? <LoaderIcon className="animate-spin size-2.5" /> : "Verify Code"}
          </Button>

          <Button
            type="button"
            onClick={() => sendForm.handleSubmit(onSendSubmit)()}
            disabled={IPSendOtp}
            variant={"link"}
          >
            {IPSendOtp ? <LoaderIcon className="animate-spin size-2.5" /> : "Resend code"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}