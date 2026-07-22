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
import { Building2 } from "lucide-react";

type ISubscription = Infer["AdminSubscriptionGetAll"]["res"][number];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
    case "TRIALING":
      return "default";
    case "PAST_DUE":
      return "secondary";
    case "CANCELED":
    default:
      return "outline";
  }
};

export const columns: ColumnDef<ISubscription>[] = [
  {
    id: "organization",
    header: () => <PrimitiveHeader label="Organization" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 px-2 py-1">
        <div className="size-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          <Building2 className="size-4" />
        </div>
        <span className="text-xs-m font-medium text-foreground">
          {row.original.organization.name}
        </span>
      </div>
    ),
  },
  {
    id: "tier",
    header: () => <PrimitiveHeader label="Tier" />,
    cell: ({ row }) => (
      <div className="px-2">
        <Badge variant="secondary" className="capitalize text-xs font-normal">
          {row.original.tier}
        </Badge>
      </div>
    ),
    size: 130,
  },
  {
    id: "status",
    header: () => <PrimitiveHeader label="Status" />,
    cell: ({ row }) => (
      <div className="px-2">
        <Badge variant={getStatusVariant(row.original.status)} className="capitalize text-xs font-normal">
          {row.original.status.toLowerCase().replace("_", " ")}
        </Badge>
      </div>
    ),
    size: 130,
  },
  {
    id: "seats",
    header: () => <PrimitiveHeader label="Capacity" />,
    cell: ({ row }) => (
      <PrimitiveCell
        label={
          row.original.isUnlimited
            ? "Unlimited"
            : `${row.original.seats} seat${row.original.seats > 1 ? "s" : ""}`
        }
      />
    ),
    size: 120,
  },
  {
    id: "currentPeriodEnd",
    header: () => <PrimitiveHeader label="Period End" />,
    cell: ({ row }) =>
      row.original.currentPeriodEnd ? (
        <DateCell date={row.original.currentPeriodEnd} />
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
