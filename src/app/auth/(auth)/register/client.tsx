"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Infer } from "@/data/types.base";
import ZUser from "@/data/modules/user/user.schema";
import { nuqs } from "@/lib/utils/nuqs";
import useApi from "@/data/hooks/use-api";
import { ROUTES } from "@/lib/constants/routes";
import { toastManager } from "@/components/ui/toast";
import TextBlock from "@/components/auth/form-blocks/text-block";
import PasswordBlock from "@/components/auth/form-blocks/password-block";
import CheckBlock from "@/components/auth/form-blocks/check-block";
import { LoaderIcon } from "lucide-react";
import GoogleAuthButton from "@/components/auth/google-oauth-button";

const ZForm = ZUser.PublicUserRegister.shape.body;
type IForm = Infer["PublicUserRegister"]["body"];

export default function ClientPage() {
  const [params] = nuqs.getStates("register");
  const router = useRouter();
  const { mutate, isPending } = useApi.mutate("public:user:register");
  const loginUrl = nuqs.getUrl("login", { redirect: params.redirect }, ROUTES.AUTH.LOGIN);

  const { handleSubmit, control } = useForm<IForm>({
    resolver: zodResolver(ZForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: IForm) => {
    mutate(data, {
      onSuccess: () => {
        const url = nuqs.getUrl(
          "verifyEmail",
          { email: data.email, redirect: params.redirect },
          ROUTES.AUTH.VERIFY_EMAIL
        );
        router.push(url);
      },
      onError: (err) => {
        toastManager.add({
          title: "Registration failed. Please try again.",
          type: "error"
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-center text-xl font-medium tracking-tight">Create Account</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <TextBlock control={control} name="name" placeholder="Enter your full name" autoComplete="name" />
        <TextBlock control={control} name="email" type="email" placeholder="Enter your email" autoComplete="email" />
        <PasswordBlock control={control} name="password" placeholder="Enter your password" autoComplete="new-password" />
        <PasswordBlock control={control} name="confirmPassword" placeholder="Confirm your password" autoComplete="new-password" />

        <CheckBlock
          control={control}
          name="agreeToTerms"
          label={
            <>
              I agree to the{" "}
              <Link href={ROUTES.LEGAL.TERMS} className="underline text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href={ROUTES.LEGAL.PRIVACY} className="underline text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                Privacy Policy
              </Link>
            </>
          }
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin size-4" /> : "Create Account"}
        </Button>

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

        {/* Sign in link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={loginUrl} className="underline text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}