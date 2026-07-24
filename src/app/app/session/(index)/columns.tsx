"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "@/data/types.base";
import {
  PrimitiveHeader,
  PrimitiveCell,
  DurationCell,
  HostCell,
  StatusCell
} from "@/components/particles/column-blocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ISchema = Infer["SesSessionGetAll"]["res"][number];

export const columns: ColumnDef<ISchema>[] = [
  {
    id: "duration",
    header: () => <PrimitiveHeader label="Duration" />,
    cell: ({ row }) => (
      <DurationCell
        startedAt={row.original.startedAt}
        endedAt={row.original.endedAt}
      />
    ),
    size: 220,
  },
  {
    id: "module",
    header: () => <PrimitiveHeader label="Module" />,
    cell: ({ row }) => (
      <PrimitiveCell
        label={`${row.original.moduleVersion.module.title} (v${row.original.moduleVersion.versionNumber})`}
      />
    ),
  },
  {
    id: "collection",
    header: () => <PrimitiveHeader label="Collection" />,
    cell: ({ row }) => (
      <PrimitiveCell
        label={row.original.moduleVersion.module.collection.name}
      />
    ),
  },
  {
    id: "host",
    header: () => <PrimitiveHeader label="Host" />,
    cell: ({ row }) => (
      <HostCell
        name={row.original.host.name}
        image={row.original.host.image}
      />
    ),
    size: 160,
  },
  {
    id: "status",
    header: () => <PrimitiveHeader label="Status" />,
    cell: ({ row }) => <StatusCell status={row.original.status} />,
    size: 120,
  },
  {
    id: "action",
    cell: ({ row }) => (
      <div className="px-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/app/session/${row.original.id}`} />}
        >
          View Session
        </Button>
      </div>
    ),
    size: 140,
  },
];