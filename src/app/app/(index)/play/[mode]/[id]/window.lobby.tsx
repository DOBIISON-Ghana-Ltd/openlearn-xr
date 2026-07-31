"use client";

import useApi from "@/data/hooks/use-api";
import { IClientPage } from "./client";
import { Button } from "@/components/ui/button";
import { AVATARS } from "@/lib/constants/avatars";
import { formatDate } from "@/lib/utils/format-date";
import Image from "next/image";
import { Infer } from "@/data/types.base";
import { match } from "ts-pattern";
import { useStore } from "zustand";
import { simStore } from "@/store/sim/store";

type IWindowLobby = {} & Pick<IClientPage, "id">;

export default function WindowLobby(props: IWindowLobby) {
  const { id } = props;
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(id));
  const removeSession = useStore(simStore, (s) => s.removeSession);

  const { data: stats } = useApi.query("sim:session:get:stats", { id });
  const { data: players, isLoading } = useApi.query("sim:session:get:players", { id });
  const { mutate: leaveSession, isPending: isLeaving } = useApi.mutate("sim:session:post:leave");

  const count = players?.length ?? 0;
  const status = isLoading ? "loading" : count > 0 ? "success" : "empty";

  const handleLeave = () => {
    if (!playerId) return;
    leaveSession(
      { params: { id }, body: { playerId } },
      {
        onSuccess: () => {
          removeSession(id);
        },
      }
    );
  };

  return (
    <div className="size-full flex flex-col items-center">
      <div className="w-full max-w-2xl py-12 px-6 flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">{stats?.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {match(status)
                .with("loading", () => "Loading players...")
                .with("empty", () => "Waiting for players...")
                .with("success", () =>
                  match(count)
                    .with(1, () => "1 player in lobby")
                    .otherwise(() => `${count} players in lobby`)
                )
                .exhaustive()}
            </p>
          </div>
          <Button
            variant="outline"
            disabled={isLeaving}
            loading={isLeaving}
            onClick={handleLeave}
          >
            Leave
          </Button>
        </div>

        {/* Players List */}
        {match(status)
          .with("loading", () => <Players.Loading />)
          .with("empty", () => <Players.Empty />)
          .with("success", () => <Players data={players!} />)
          .exhaustive()}
      </div>
    </div>
  );
}

type IPlayers = {
  data: Infer["SimSessionGetPlayers"]["res"];
};

function Players(props: IPlayers) {
  const { data } = props;

  return (
    <div className="w-full space-y-4">
      {data.map((player, index) => (
        <PlayerCard key={index} data={player} />
      ))}
    </div>
  );
}

Players.Loading = function Loading() {
  return (
    <div className="w-full flex-center py-12">
      <p className="text-base text-foreground font-normal">
        Loading lobby players…
      </p>
    </div>
  );
};

Players.Empty = function Empty() {
  return (
    <div className="w-full flex-center py-12">
      <p className="text-base text-foreground font-normal">
        No players have joined yet
      </p>
    </div>
  );
};

type IPlayerCard = {
  data: IPlayers["data"][number];
};

function PlayerCard(props: IPlayerCard) {
  const { data } = props;
  const avatarSrc = AVATARS[data.avatar as keyof typeof AVATARS];

  return (
    <div className="flex items-center h-16 border px-5 rounded-sm shadow-2xs space-x-4 bg-background hover:bg-muted/20">
      <div className="relative size-11 rounded-full overflow-hidden shrink-0 bg-muted border">
        <Image
          fill
          sizes="44px"
          src={avatarSrc}
          alt={data.name}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-foreground truncate">{data.name}</p>
      </div>
      <div className="shrink-0">
        <p className="text-sm font-normal text-muted-foreground">
          Joined {formatDate(data.joinedAt, "public")}
        </p>
      </div>
    </div>
  );
}