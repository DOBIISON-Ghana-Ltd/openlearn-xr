"use client";

import { Button } from "@/components/ui/button";
import { DialogPrimitive, DialogTrigger } from "@/components/ui/dialog";
import NewCollectionDialog from "./new-collection";
import { DataTable } from "@/components/particles/data-table";
import { columns } from "./columns";
import useApi from "@/data/hooks/use-api";

const newCollectionHandle = DialogPrimitive.createHandle();

export default function ClientPage() {
  const { data: collections, isLoading } = useApi.query("editor:collection:get:all");

  return (
    <div className="size-full flex flex-col">
      {/* HEADER */}
      <div className="w-full h-16 px-5 pb-4 gap-1 flex-center justify-between">
        <div>
          <h1 className="text-lg font-normal text-foreground">
            Collections
          </h1>
        </div>
        <div>
          <DialogTrigger
            handle={newCollectionHandle}
            render={<Button size="sm" />}
          >
            New Collection
          </DialogTrigger>
        </div>
      </div>
      <div className="px-5 flex-1">
        <DataTable columns={columns} data={collections || []} loading={isLoading} />
      </div>
      <NewCollectionDialog handle={newCollectionHandle} />
    </div>
  );
}