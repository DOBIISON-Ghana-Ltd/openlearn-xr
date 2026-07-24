"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "@/data/types.base";
import {
  PrimitiveHeader,
  PrimitiveCell,
  DateCell,
} from "@/components/particles/column-blocks";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuPopup, MenuGroup, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { MoreVertical } from "lucide-react";
import useApi from "@/data/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";
import { AVATARS } from "@/lib/constants/avatars";
import { ZRoleList } from "@/data/schema.base";

type IUser = Infer["AdminUserGetAll"]["res"][number];

function UserRoleActions({ user }: { user: IUser }) {
  const qc = useQueryClient();
  const { data: me } = useApi.query("app:user:get:me");
  const { mutate: setRole, isPending } = useApi.mutate("admin:user:patch:role");

  if (me?.id === user.id) {
    return null;
  }

  const roles = ZRoleList.parse(user.role);
  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  const isUserOnly = !isAdmin && !isEditor;

  const handleAssignRole = (newRoles: Infer["AdminUserPatchRole"]["body"]["role"]) => {
    setRole(
      { userId: user.id, role: newRoles },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [...QUERY_KEYS["admin:user:get:all"]] });
        },
      }
    );
  };

  return (
    <div className="px-2 flex justify-end">
      <Menu>
        <MenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
          <MoreVertical className="size-4 text-muted-foreground" />
        </MenuTrigger>
        <MenuPopup align="end" className="w-44">
          <MenuGroup>
            <MenuItem
              disabled={isPending || isUserOnly}
              onClick={() => handleAssignRole(["user"])}
            >
              Assign as User
            </MenuItem>
            <MenuItem
              disabled={isPending || (isEditor && !isAdmin)}
              onClick={() => handleAssignRole(["user", "editor"])}
            >
              Assign as Editor
            </MenuItem>
            <MenuItem
              disabled={isPending || isAdmin}
              onClick={() => handleAssignRole(["user", "admin"])}
            >
              Assign as Admin
            </MenuItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </div>
  );
}

export const columns: ColumnDef<IUser>[] = [
  {
    id: "user",
    header: () => <PrimitiveHeader label="User" />,
    cell: ({ row }) => {
      const avatarSrc = row.original.image ? AVATARS[row.original.image] : undefined;
      return (
        <div className="flex items-center gap-3 px-2 py-1">
          <Avatar className="size-7 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={row.original.name} />}
          </Avatar>
          <span className="text-xs-m font-medium text-foreground">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    id: "email",
    header: () => <PrimitiveHeader label="Email" />,
    cell: ({ row }) => <PrimitiveCell label={row.original.email} />,
  },
  {
    id: "role",
    header: () => <PrimitiveHeader label="Role" />,
    cell: ({ row }) => {
      const roles = ZRoleList.parse(row.original.role);
      const isAdmin = roles.includes("admin");
      const isEditor = roles.includes("editor");

      const label = isAdmin ? "Admin" : isEditor ? "Editor" : "User";
      const variant = isAdmin ? "default" : isEditor ? "secondary" : "outline";

      return (
        <div className="px-2">
          <Badge variant={variant} className="capitalize text-xs font-normal">
            {label}
          </Badge>
        </div>
      );
    },
    size: 110,
  },
  {
    id: "createdAt",
    header: () => <PrimitiveHeader label="Joined" />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    size: 160,
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRoleActions user={row.original} />,
    size: 60,
  },
];
