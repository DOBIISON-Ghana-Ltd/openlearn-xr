'use client';

import { Logo } from '@/components/(new)/common/logo';
import Image from 'next/image';
import { IClientPage } from './client';
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import ZSim from "@/data/api/sim/sim.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "zustand";
import { simStore } from '@/store/sim/store';
import TextBlock from '@/components/(new)/form-blocks/text-block';
import { match } from 'ts-pattern';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/lib/constants/paths';
import { toastManager } from '@/components/ui/toast';
import { getRandomAvatar } from '@/lib/utils/get-random-avatar';

const ZForm = ZSim.SimSessionPostJoin.shape.body;
type IForm = Infer["SimSessionPostJoin"]["body"];

type IEntrance = {} & IClientPage;
export default function Entrance(props: IEntrance) {
  const { id } = props;
  const router = useRouter();
  const addSession = useStore(simStore, (s) => s.addSession);
  const { mutate, isPending } = useApi.mutate("sim:session:post:join");

  const defaultValues: IForm = {
    name: "",
    joinCode: id || "",
    avatar: getRandomAvatar(),
  };

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    mutate(
      { body: data },
      {
        onError: (err) => {
          toastManager.add({
            title: err.message || "Failed to join session. Please try again.",
            type: "error",
          });
        },
        onSettled(resData, error) {
          reset(defaultValues);
          if (resData && !error) {
            addSession(resData.joinCode, {
              sessionId: resData.sessionId,
              playerId: resData.playerId,
              isHost: false,
              config: resData.config,
            });
            router.replace(PATHS.PLAY("session", resData.joinCode));
          }
        },
      }
    );
  };

  return (
    <div className="relative w-full h-dvh min-h-dvh bg-surface-white flex items-center overflow-hidden">

      <div className="relative size-full max-w-lg shrink-0">
        <div className="absolute top-0 left-0 size-full overflow-hidden">
          <Image
            src="/(new)/bg/image-01.png"
            alt="Open Learn XR Lab"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute right-0 inset-y-0 w-28 bg-linear-to-r from-surface-white/0 via-surface-white/70 to-surface-white pointer-events-none z-10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 h-full flex-center flex-col p-6 lg:p-12 min-w-0">
        <div className="w-full max-w-sm flex flex-col items-center gap-7">
          <div className="flex justify-center mb-1">
            <Logo className="w-46 h-auto" />
          </div>

          <h1 className="text-h6 text-primary-text-dark text-center">
            Join a Session
          </h1>

          <div className="w-full flex flex-col gap-6">
            <TextBlock name="name" control={control} placeholder="Enter your full name" />
            <TextBlock name="joinCode" control={control} placeholder="Enter session code or link" />
            <button
              type="submit"
              className="relative w-full h-12 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-lg flex-center transition-all cursor-pointer shadow-xs active:scale-98"
            >
              {match(isPending)
                .with(false, () => "Join")
                .with(true, () => <Loader2Icon className="size-5 animate-spin" />)
                .exhaustive()
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}