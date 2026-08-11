"use client";

import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import { AVATARS } from "@/lib/constants/avatars";
import { PATHS } from "@/lib/constants/paths";
import Link from "next/link";
import { match, P } from "ts-pattern";

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
  return (
    <div className="size-12 rounded-full overflow-hidden shrink-0 cursor-pointer">
      <img
        src={AVATARS[data.image]}
        alt={data.name || "User profile"}
        className="size-12 rounded-full object-cover border-2 border-transparent hover:border-primary-cta/40 transition-colors"
      />
    </div>
  );
}

HeaderProfile.Loading = function Loading() {
  return <div className="size-12 rounded-full bg-surface-slate animate-pulse shrink-0" />;
};

