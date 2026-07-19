"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "@/data/types.base";
import {
  PrimitiveHeader,
  PrimitiveCell,
  DateCell,
  StatusCell
} from "@/components/particles/column-blocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ISchema = Infer["PublicModuleCompletionGetAll"]["res"][number];

export const columns: ColumnDef<ISchema>[] = [
  {
    id: "lastPlayedAt",
    header: () => <PrimitiveHeader label="Last Played" />,
    cell: ({ row }) => <DateCell date={row.original.lastPlayedAt} />,
    size: 180,
  },
  {
    id: "module",
    header: () => <PrimitiveHeader label="Module" />,
    cell: ({ row }) => (
      <PrimitiveCell
        label={
          row.original.module.title +
          (row.original.lastPlayedVersion ? ` (v${row.original.lastPlayedVersion.versionNumber})` : "")
        }
      />
    ),
  },
  {
    id: "collection",
    header: () => <PrimitiveHeader label="Collection" />,
    cell: ({ row }) => (
      <PrimitiveCell label={row.original.module.collection.name} />
    ),
  },
  {
    id: "highScore",
    header: () => <PrimitiveHeader label="High Score" />,
    cell: ({ row }) => <PrimitiveCell label={String(row.original.highScore)} />,
    size: 120,
  },
  {
    id: "totalPlays",
    header: () => <PrimitiveHeader label="Total Plays" />,
    cell: ({ row }) => <PrimitiveCell label={String(row.original.totalPlays)} />,
    size: 120,
  },
  {
    id: "status",
    header: () => <PrimitiveHeader label="Status" />,
    cell: ({ row }) => <StatusCell status="COMPLETED" />,
    size: 120,
  },
  {
    id: "action",
    cell: ({ row }) => (
      <div className="px-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/app/play/free/${row.original.module.id}`} />}
        >
          Play Again
        </Button>
      </div>
    ),
    size: 140,
  },
];