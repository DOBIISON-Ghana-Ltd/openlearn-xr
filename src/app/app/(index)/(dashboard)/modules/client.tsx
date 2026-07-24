"use client";

import ModuleCard from "@/components/particles/module-card";
import useApi from "@/data/hooks/use-api";
import { Infer } from "@/data/types.base";
import { nuqs } from "@/lib/utils/nuqs";
import Filtering from "./fltering";

export default function ClientPage() {
  const [state] = nuqs.getStates("sim:modules");
  const { data: modules, isLoading } = useApi.query("sim:module:get:all", state);

  return (
    <div className="size-full">
      {/* HEADER */}
      <div className="w-full px-5 py-4 gap-1 flex-center justify-between">
        <h1 className="text-xl font-normal text-foreground">
          Modules
        </h1>
        <Filtering />
      </div>
      {/* CONTENT */}
      <Content modules={modules} />
    </div>
  );
};

type IContent = {
  modules: Infer["SimModuleGetAll"]["res"]
}
function Content(props: IContent) {
  const { modules } = props;

  return (
    <div className="px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {modules?.map((module) => {
        return (
          <ModuleCard
            key={module.id}
            mode="module"
            data={module}
          />
        );
      })}
    </div>
  )
}
