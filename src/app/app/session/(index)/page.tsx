"use client";

import { DataTable } from "@/components/particles/data-table";
import { columns } from "./columns";
import useApi from "@/data/hooks/use-api";
import { DialogPrimitive, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NewSessionDialog from "@/components/particles/new-session";

const newSessionHandle = DialogPrimitive.createHandle();

export default function Page() {
  const { data, isLoading } = useApi.query("ses:session:get:all");

  return (
    <div className="size-full flex flex-col">
      {/* HEADER */}
      <div className="w-full h-16 px-5 pb-4 gap-1 flex-center justify-between">
        <div className="">
          <h1 className="text-lg font-normal text-foreground">
            My Sessions
          </h1>
        </div>
        <div className="">
          <DialogTrigger
            handle={newSessionHandle}
            render={<Button size="sm" />}
          >
            Start a session
          </DialogTrigger>
        </div>
      </div>
      <div className="px-5 flex-1">
        <DataTable columns={columns} data={data || []} loading={isLoading} />
      </div>
      <NewSessionDialog handle={newSessionHandle} />
    </div>
  )
};