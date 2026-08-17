"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "@base-ui/react/menu";
import { LogOut, Loader2Icon } from "lucide-react";
import { match, P } from "ts-pattern";
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import { AVATARS } from "@/lib/constants/avatars";
import { PATHS } from "@/lib/constants/paths";

export default function HeaderProfile() {
  const { data: user, isLoading } = useApi.query("app:user:get:me");

  return match({ user, isLoading })
    .with({ isLoading: true }, () => <HeaderProfile.Loading />)
    .with({ user: P.nullish, isLoading: false }, () => <LoginButton />)
    .with({ user: P.select(P.nonNullable) }, (user) => <ProfileAvatar data={user} />)
    .exhaustive();
}

function LoginButton() {
  return (
    <Link
      href={PATHS.AUTH.LOGIN}
      className="inline-flex items-center justify-center bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button px-5 py-2.5 rounded-[10px] transition-colors"
    >
      Sign in
    </Link>
  );
}

type IProfileAvatar = {
  data: Infer["AppUserGetMe"]["res"];
};

function ProfileAvatar({ data }: IProfileAvatar) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useApi.mutate("app:user:logout");

  const handleLogout = () => {
    logout(undefined as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS["app:user:get:me"]] });
        router.refresh();
      },
    });
  };

  return (
    <Menu.Root>
      <Menu.Trigger className="size-12 rounded-full overflow-hidden shrink-0 cursor-pointer border-2 border-transparent hover:border-primary-cta/40 transition-colors outline-none">
        <img
          src={AVATARS[data.image].image}
          alt={data.name || "User profile"}
          className="size-full rounded-full object-cover"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50 select-none">
          <Menu.Popup className="bg-surface-white border border-disable/20 rounded-xl shadow-lg p-1.5 min-w-44 outline-none focus:outline-none">
            <Menu.Item
              onClick={handleLogout}
              disabled={isPending}
              className="flex items-center gap-2.5 px-3 py-2 text-small text-error font-medium rounded-lg cursor-pointer outline-none hover:bg-error/10 transition-colors data-highlighted:bg-error/10 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4 rotate-180" />
              )}
              <span>Log out</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

HeaderProfile.Loading = function Loading() {
  return <div className="size-12 rounded-full bg-surface-slate animate-pulse shrink-0" />;
};
