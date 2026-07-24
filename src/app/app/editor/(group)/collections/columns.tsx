"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "@/data/types.base";
import {
  PrimitiveHeader,
  PrimitiveCell,
  DateCell,
} from "@/components/particles/column-blocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ISchema = Infer["EditorCollectionGetAll"]["res"][number];

export const columns: ColumnDef<ISchema>[] = [
  {
    id: "name",
    header: () => <PrimitiveHeader label="Collection Name" />,
    cell: ({ row }) => <PrimitiveCell label={row.original.name} />,
  },
  {
    id: "description",
    header: () => <PrimitiveHeader label="Description" />,
    cell: ({ row }) => (
      <PrimitiveCell label={row.original.description || "—"} />
    ),
  },
  {
    id: "modulesCount",
    header: () => <PrimitiveHeader label="Modules" />,
    cell: ({ row }) => (
      <PrimitiveCell label={String(row.original._count?.modules ?? 0)} />
    ),
    size: 100,
  },
  {
    id: "createdAt",
    header: () => <PrimitiveHeader label="Created" />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    size: 180,
  },
  {
    id: "action",
    cell: ({ row }) => (
      <div className="px-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/app/editor/collections/${row.original.id}`} />}
        >
          Edit Collection
        </Button>
      </div>
    ),
    size: 150,
  },
];
