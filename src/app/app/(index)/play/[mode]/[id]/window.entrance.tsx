"use client";

import useApi from "@/data/hooks/use-api";
import { IClientPage } from "./client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Infer } from "@/data/types.base";
import ZSim from "@/data/api/sim/sim.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nuqs } from "@/lib/utils/nuqs";
import { simStore } from "@/store/sim/store";
import { useStore } from "zustand";

const ZForm = ZSim.SimSessionPostJoin.shape.body;
type IForm = Infer["SimSessionPostJoin"]["body"];

type IWindowEntrance = {} & Pick<IClientPage, "id">;
export default function WindowEntrance(props: IWindowEntrance) {
  const { id } = props;
  const [params, setParams] = nuqs.getStates("sim:play");
  const addSession = useStore(simStore, (s) => s.addSession);
  const { data } = useApi.query("sim:session:get:stats", { id });
  const { mutate, isPending } = useApi.mutate("sim:session:post:join");

  const defaultValues: IForm = {
    name: "",
    joinCode: params.code || ""
  };

  const { handleSubmit, register, reset } = useForm({
    resolver: zodResolver(ZForm),
    defaultValues,
  });

  const onSubmit = (data: IForm) => {
    mutate({ body: data }, {
      onSuccess: (resData) => {
        addSession(resData.joinCode, {
          sessionId: resData.sessionId,
          playerId: resData.playerId,
        });
        setParams({ code: null });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="size-full flex-center">
      <div className="w-full max-w-md p-3 bg-muted rounded-md">
        <div className="size-full bg-background px-4 py-14 flex flex-col items-center space-y-10 rounded-md border">
          {/* header */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-medium text-foreground">Join. Session.</h1>
            <p className="text-xl font-normal text-foreground">{data?.name}</p>
          </div>
          {/* form input */}
          <div className="flex flex-col items-center space-y-4 w-full">
            <Input
              {...register("name")}
              className="h-12 w-64 rounded-full [&_input]:text-center [&_input]:h-full [&_input]:text-xl [&_input]:font-semibold"
              placeholder="NAME"
            />
            <Input
              {...register("joinCode")}
              maxLength={6}
              className="h-12 w-64 rounded-full [&_input]:text-center [&_input]:h-full [&_input]:text-xl [&_input]:uppercase [&_input]:tracking-[0.25em] [&_input]:pl-[0.25em] [&_input]:font-semibold"
              placeholder="123456"
            />
          </div>
          {/* button */}
          <div className="w-full flex-center">
            <Button loading={isPending} type="submit" className="h-12! w-full max-w-64 rounded-full text-xl! font-semibold">
              Join
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}