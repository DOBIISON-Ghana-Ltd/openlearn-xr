"use client";

import { Button } from "@/components/ui/button"
import { Group, GroupSeparator } from "@/components/ui/group"
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import { PlayIcon, Share2Icon } from "lucide-react";
import { IClientPage } from "./client";
import { match } from "ts-pattern";
import { Popover, PopoverDescription, PopoverPopup, PopoverPrimitive, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import QRCode from "react-qr-code";
import { useClipboard } from "@mantine/hooks";
import { CheckIcon, CopyIcon } from "lucide-react";
import { getShareUrl } from "@/lib/utils/get-share-url";
import { toastManager } from "@/components/ui/toast";

const shareHandle = PopoverPrimitive.createHandle();

type ILobby = {
  joinCode: string;
} & IClientPage;
export default function Lobby({ id, joinCode }: ILobby) {
  const { data, isLoading } = useApi.query("ses:session:get:players", { id });
  const { mutate: startSession, isPending } = useApi.mutate("ses:session:post:start");

  const state = {
    isLoading: !!isLoading,
    hasData: (data?.length ?? 0) > 0
  }

  const handleStart = () => {
    startSession({ id }, {
      onSuccess: (data) => {
        toastManager.add({ title: data, type: "success" });
      }
    });
  };

  return (
    <div className="w-full px-5 space-y-7">
      <div className="w-full h-104 rounded-md overflow-hidden bg-muted/50">
        {match(state)
          .with({ isLoading: true }, () => <Participants.Loading />)
          .with({ isLoading: false, hasData: true }, () => <Participants data={data!} />)
          .with({ isLoading: false, hasData: false }, () => <Participants.Empty />)
          .exhaustive()}
      </div>
      <div className="w-full flex-center">
        <Group>
          <PopoverTrigger handle={shareHandle} render={<Button variant="outline" />}>
            <Share2Icon />
            Share
          </PopoverTrigger>
          <GroupSeparator />
          <Button variant="outline" loading={isPending} disabled={isPending} onClick={handleStart}>
            <PlayIcon />
            Start
          </Button>
        </Group>
      </div>
      <SharePopover handle={shareHandle} id={id} joinCode={joinCode} />
    </div>
  )
};

type IParticipants = {
  data: Infer["SesSessionGetPlayers"]["res"]
}
function Participants({ data }: IParticipants) {
  return (
    <div className="size-full flex-center">
      <div className="">
        {data.length} players joined
      </div>
    </div>
  )
};

Participants.Empty = function Empty() {
  return (
    <div className="size-full flex-center text-sm text-muted-foreground">
      No participants joined yet
    </div>
  )
}

Participants.Loading = function Loading() {
  return (
    <div className="size-full flex-center text-sm text-muted-foreground">
      Loading participants…
    </div>
  )
};

function SharePopover(props: PopoverPrimitive.Root.Props & ILobby) {
  const shareUrl = getShareUrl(props.id, props.joinCode);
  const clipboard = useClipboard({ timeout: 2000 });

  return (
    <Popover {...props}>
      <PopoverPopup className="w-72 rounded-sm">
        <div className="flex flex-col space-y-4">
          <div>
            <PopoverTitle>Share</PopoverTitle>
            <PopoverDescription>Scan the QR code or copy the link to share this session.</PopoverDescription>
          </div>
          <div className="w-full py-2 bg-muted/60 border rounded-md flex flex-col items-center justify-center">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Join Code</span>
            <span className="text-2xl font-bold tracking-[0.25em] pl-[0.25em] text-foreground font-mono">{props.joinCode}</span>
          </div>
          <div className="w-full aspect-square bg-muted flex items-center justify-center p-4 rounded-md">
            <QRCode
              value={shareUrl}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="w-full h-9 gap-1 flex items-center justify-between border rounded-sm pl-3 pr-1">
            <p className="flex-1 text-sm truncate text-muted-foreground">{shareUrl}</p>
            <Button
              size="icon-xs"
              variant="secondary"
              className="shrink-0"
              onClick={() => clipboard.copy(shareUrl)}
            >
              {clipboard.copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
            </Button>
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}