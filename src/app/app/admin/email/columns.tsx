"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "@/data/types.base";
import {
  PrimitiveHeader,
  PrimitiveCell,
  DateCell,
} from "@/components/particles/column-blocks";
import { Badge } from "@/components/ui/badge";

type IEmailLog = Infer["AdminEmailLogGetAll"]["res"][number];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "SENT":
      return "default";
    case "QUEUED":
      return "secondary";
    case "FAILED":
    case "BOUNCED":
    default:
      return "destructive";
  }
};

export const columns: ColumnDef<IEmailLog>[] = [
  {
    id: "to",
    header: () => <PrimitiveHeader label="Recipient" />,
    cell: ({ row }) => <PrimitiveCell label={row.original.to} />,
  },
  {
    id: "subject",
    header: () => <PrimitiveHeader label="Subject" />,
    cell: ({ row }) => <PrimitiveCell label={row.original.subject} />,
  },
  {
    id: "template",
    header: () => <PrimitiveHeader label="Template" />,
    cell: ({ row }) => (
      <PrimitiveCell label={row.original.template || "—"} />
    ),
    size: 140,
  },
  {
    id: "status",
    header: () => <PrimitiveHeader label="Status" />,
    cell: ({ row }) => (
      <div className="px-2">
        <Badge variant={getStatusVariant(row.original.status)} className="capitalize text-xs font-normal">
          {row.original.status.toLowerCase()}
        </Badge>
      </div>
    ),
    size: 110,
  },
  {
    id: "sentAt",
    header: () => <PrimitiveHeader label="Sent At" />,
    cell: ({ row }) =>
      row.original.sentAt ? (
        <DateCell date={row.original.sentAt} />
      ) : (
        <PrimitiveCell label="—" />
      ),
    size: 160,
  },
  {
    id: "createdAt",
    header: () => <PrimitiveHeader label="Created" />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    size: 160,
  },
];
