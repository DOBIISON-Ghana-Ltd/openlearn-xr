"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ZUser from "@/data/modules/user/user.schema";
import { Button } from "@/components/ui/button";
import TextBlock from "@/components/auth/form-blocks/text-block";
import PasswordBlock from "@/components/auth/form-blocks/password-block";
import GoogleAuthButton from "@/components/auth/google-oauth-button";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { ROUTES } from "@/lib/constants/routes";
import { toastManager } from "@/components/ui/toast";
import { LoaderIcon } from "lucide-react";

const ZForm = ZUser.PublicUserLogin.shape.body;
type IForm = Infer["PublicUserLogin"]["body"];

export default function ClientPage() {
  const [params] = nuqs.getStates("login");
  const router = useRouter();
  const { mutate: login, isPending } = useApi.mutate("public:user:login");

  const { handleSubmit, control, getValues } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { email: "", password: "" },
  });

  const registerUrl = nuqs.getUrl("register", { redirect: params.redirect }, ROUTES.REGISTER);
  const forgotPasswordUrl = nuqs.getUrl("forgotPassword", { redirect: params.redirect }, ROUTES.FORGOT_PASSWORD);

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
          router.push(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(getValues("email"))}`);
        }
        //if login error show sonner toast invalid password
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
    <div className="space-y-6">
      <h1 className="text-center text-xl font-medium tracking-tight">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <TextBlock control={control} name="email" type="email" placeholder="Enter your email" autoComplete="email" />
        <PasswordBlock control={control} name="password" placeholder="Enter your password" autoComplete="current-password" />

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href={forgotPasswordUrl}
            className="underline text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin size-2.5" /> : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton />

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={registerUrl} className="underline text-primary hover:text-primary/80 font-medium transition-colors">
          Register
        </Link>
      </p>
    </div>
  );
}