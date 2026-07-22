"use client";

import { DataTable } from "@/components/particles/data-table";
import { columns } from "./columns";
import useApi from "@/data/hooks/use-api";

export default function ClientPage() {
  const { data: logs, isLoading } = useApi.query("admin:email-log:get:all");

  return (
    <div className="size-full flex flex-col">
      {/* HEADER */}
      <div className="w-full h-16 px-5 pb-4 gap-1 flex-center justify-between">
        <div>
          <h1 className="text-lg font-normal text-foreground">
            Email Logs
          </h1>
        </div>
      </div>
      <div className="px-5 flex-1">
        <DataTable columns={columns} data={logs || []} loading={isLoading} />
      </div>
    </div>
  );
}
