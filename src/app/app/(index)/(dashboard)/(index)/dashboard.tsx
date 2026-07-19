"use client";

import { DataTable } from "@/components/particles/data-table";
import { columns } from "./columns";
import useApi from "@/data/hooks/use-api";

export default function Dashboard() {
  const { data, isLoading } = useApi.query("public:module-completion:get:all");

  return (
    <div className="size-full flex flex-col">
      <div className="w-full h-16 px-5 pb-4 gap-1 flex-center justify-between">
        <div className="">
          <h1 className="text-lg font-normal text-foreground">
            My History
          </h1>
        </div>
      </div>
      <div className="px-5 flex-1">
        <DataTable columns={columns} data={data || []} loading={isLoading} />
      </div>
    </div>
  )
}