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

type ISchema = Infer["EditorModuleGetAll"]["res"][number];

export const columns: ColumnDef<ISchema>[] = [
  {
    id: "title",
    header: () => <PrimitiveHeader label="Module Title" />,
    cell: ({ row }) => <PrimitiveCell label={row.original.title} />,
  },
  {
    id: "collection",
    header: () => <PrimitiveHeader label="Collection" />,
    cell: ({ row }) => (
      <PrimitiveCell label={row.original.collection.name} />
    ),
  },
  {
    id: "orderIndex",
    header: () => <PrimitiveHeader label="Order Index" />,
    cell: ({ row }) => (
      <PrimitiveCell label={String(row.original.orderIndex)} />
    ),
    size: 110,
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
          render={<Link href={`/app/editor/${row.original.id}`} />}
        >
          Edit Module
        </Button>
      </div>
    ),
    size: 140,
  },
];
