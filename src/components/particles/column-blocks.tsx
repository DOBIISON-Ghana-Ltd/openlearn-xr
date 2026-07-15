"use client";

import { formatDate } from "@/lib/utils/format-date";
import { MoreVertical, LucideIcon, InfoIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MenuPopup, MenuGroup, MenuItem, MenuTrigger } from "@/components/ui/menu";

export {
  PrimitiveHeader,
  PrimitiveCell,
  LocationCell,
  RoleCell,
  DateCell,
  StatusCell01,
  StatusCell02,
  OrgListCell01,
  ActionCell
}

type IHeader = {
  icon?: LucideIcon;
  label: string;
}
const PrimitiveHeader = (props: IHeader) => {
  return (
    <div className="px-2 flex items-center gap-1 text-muted-foreground">
      {/* icon */}
      {props.icon && <props.icon className="size-4.5" />}

      {/* label */}
      <p className="font-normal">
        {props.label}
      </p>
    </div>
  )
}

type IPrimitiveCell = {
  label: string;
}
const PrimitiveCell = (props: IPrimitiveCell) => {
  return (
    <p className="px-2 flex items-center">
      {props.label}
    </p>
  )
}

type ILocationCell = {
  location: { city: string; country: string } | null;
}
const LocationCell = (props: ILocationCell) => {
  return (
    <p className="px-2 flex items-center">
      {props.location ? `${props.location.city}, ${props.location.country}` : "N/A"}
    </p>
  )
}

type IRoleCell = {
  role: string[];
  map?: Record<string, string>;
}
const RoleCell = (props: IRoleCell) => {
  const { role, map = {} } = props;

  return (
    <div className="px-2 flex items-center gap-1">
      {role.map((r) => {
        const label = map[r] || r.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return (
          <p key={r}>
            {label}
          </p>
        );
      })}
    </div>
  )
}

type IDateCell = {
  date: string | Date | null;
}
const DateCell = (props: IDateCell) => {
  const { date } = props;

  const dateString = date instanceof Date ? date.toISOString() : date;

  return (
    <p className="px-2 flex items-center">
      {formatDate(dateString, "admin")}
    </p>
  )
};

type IStatusCell01 = {
  value: boolean;
}
const StatusCell01 = (props: IStatusCell01) => {
  const { value } = props;

  return (
    <div className="px-2 flex items-center gap-1">
      <Badge variant="outline">
        {value ? "Active" : "Inactive"}
      </Badge>
    </div>
  )
}

type IStatusCell02 = {
  value: string;
}
const StatusCell02 = (props: IStatusCell02) => {
  const { value } = props;

  return (
    <div className="px-2 flex items-center gap-1 capitalize">
      <Badge>{value}</Badge>
    </div>
  )
}

type IOrgListCell01 = {
  orgs: { organization: { id: string; name: string } }[]
}
const OrgListCell01 = (props: IOrgListCell01) => {
  const { orgs } = props;

  return (
    <div className="px-2 flex items-center gap-1 capitalize">
      {orgs.slice(0, 2).map((m) => (
        <Badge key={m.organization.id}>{m.organization.name}</Badge>
      ))}
      {orgs.length > 2 ? (<Badge>{orgs.length - 2}</Badge>) : null}
    </div>
  )
}

export type ISheetPanelProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type IActionBase = {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "danger";
}

type ISheetAction = IActionBase & {
  type: "sheet";
  panel: (props: ISheetPanelProps) => React.ReactNode;
}

type IFnAction = IActionBase & {
  type: "fn";
  onClick: () => void;
}

export type IAction = ISheetAction | IFnAction;

type IActionCell = {
  actions: IAction[];
}

const ActionCell = (props: IActionCell) => {
  const sheetActions = props.actions.filter((a): a is ISheetAction => a.type === "sheet");
  const openStates = sheetActions.map(() => useState(false));

  return (
    <div className="px-2">
      <Menu>
        <MenuTrigger render={<Button variant="ghost" size="icon-xs"/>}>
          <span className="sr-only">Open menu</span>
          <MoreVertical />
        </MenuTrigger>
        <MenuPopup className="w-44" align="start">
          <MenuGroup>
            {props.actions.map((action, i) => {
              if (action.type === "sheet") {
                const sheetIdx = sheetActions.indexOf(action);
                const [, setOpen] = openStates[sheetIdx];
                return (
                  <MenuItem
                    key={action.label}
                    onClick={() => setOpen(true)}
                    className={action.variant === "danger" ? "text-destructive focus:text-destructive" : ""}
                  >
                    {action.icon && <action.icon className="size-4" />}
                    {action.label}
                  </MenuItem>
                );
              }
              return (
                <MenuItem
                  key={action.label}
                  onClick={action.onClick}
                  className={action.variant === "danger" ? "text-destructive focus:text-destructive" : ""}
                >
                  {action.icon && <action.icon className="size-4" />}
                  {action.label}
                </MenuItem>
              );
            })}
          </MenuGroup>
        </MenuPopup>
      </Menu>
      {sheetActions.map((action, i) => {
        const [open, setOpen] = openStates[i];
        return open ? (
          <React.Fragment key={action.label}>
            {action.panel({ open, setOpen })}
          </React.Fragment>
        ) : null;
      })}
    </div>
  )
}
