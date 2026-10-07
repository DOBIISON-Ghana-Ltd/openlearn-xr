"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";
import { PATHS } from "@/lib/constants/paths";
import { SubmitButton } from "./components";
import { nuqs } from "@/lib/utils/nuqs";

export default function TabFinal() {
  const [qs] = nuqs.getStates("app:onboarding");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS["app:user:get:me"] });
  }, [queryClient]);

  const handler = () => {
    router.replace(qs.redirect || PATHS.HOME);
    router.refresh();
  };

  return (
    <div className="h-44 flex-center flex-col space-y-12">
      <h1 className="text-3xl text-neutral-700 font-medium">
        Yay!! you&apos;re onboarded
      </h1>
      <SubmitButton
        label="Continue"
        onClick={handler}
      />
    </div>
  );
}
