"use client";

import { Button } from "@/components/ui/button";
import { DialogPrimitive, DialogTrigger } from "@/components/ui/dialog";
import NewModuleDialog from "./new-module";
import { DataTable } from "@/components/particles/data-table";
import { columns } from "./columns";
import useApi from "@/data/hooks/use-api";

const newModuleHandle = DialogPrimitive.createHandle();

export default function ClientPage() {
  const { data: modules, isLoading } = useApi.query("editor:module:get:all");

  return (
    <div className="size-full flex flex-col">
      {/* HEADER */}
      <div className="w-full h-16 px-5 pb-4 gap-1 flex-center justify-between">
        <div>
          <h1 className="text-lg font-normal text-foreground">
            Modules
          </h1>
        </div>
        <div>
          <DialogTrigger
            handle={newModuleHandle}
            render={<Button size="sm" />}
          >
            New Module
          </DialogTrigger>
        </div>
      </div>
      <div className="px-5 flex-1">
        <DataTable columns={columns} data={modules || []} loading={isLoading} />
      </div>
      <NewModuleDialog handle={newModuleHandle} />
    </div>
  );
}
