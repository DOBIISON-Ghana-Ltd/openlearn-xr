"use client";

import { formatDate } from "@/lib/utils/format-date";
import { MoreVertical, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MenuPopup, MenuGroup, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { AVATARS } from "@/lib/constants/avatars";

export {
  PrimitiveHeader,
  PrimitiveCell,
  DateCell,
  ActionCell,
  DurationCell,
  HostCell,
  StatusCell
}

type IHeader = {
  label: string;
}
const PrimitiveHeader = (props: IHeader) => {
  return (
    <div className="px-2 text-muted-foreground">
      <p className="text-xs-m font-normal">
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
    <p className="px-2 py-2.5 flex items-center">
      {props.label}
    </p>
  )
}

type IDateCell = {
  date: string | Date | null;
}
const DateCell = (props: IDateCell) => {
  const { date } = props;

  const dateString = date instanceof Date ? date.toISOString() : date;

  return (
    <p className="px-2 py-2.5 flex items-center">
      {formatDate(dateString, "admin")}
    </p>
  )
};

type IChipCell = {
  value: string[];
}
const ChipCell = (props: IChipCell) => {
  const { value } = props;

  return (
    <div className="px-2 py-2.5 flex items-center gap-1 shrink-0 capitalize">
      {value.map((val) => (
        <Badge variant="outline">
          {val}
        </Badge>
      ))}
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
    <div className="px-2 py-2.5">
      <Menu>
        <MenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
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

type IDurationCell = {
  startedAt: string | Date | null;
  endedAt: string | Date | null;
}
const DurationCell = (props: IDurationCell) => {
  const { startedAt, endedAt } = props;

  const startStr = startedAt instanceof Date ? startedAt.toISOString() : startedAt;
  const endStr = endedAt instanceof Date ? endedAt.toISOString() : endedAt;

  const startFormatted = startStr ? formatDate(startStr, "numeric") : "N/A";
  const endFormatted = endStr ? formatDate(endStr, "numeric") : "N/A";

  return (
    <p className="px-2 py-2.5 flex items-center text-sm text-muted-foreground">
      {startFormatted} / {endFormatted}
    </p>
  );
}

type IHostCell = {
  name: string;
  image: string | null;
}
const HostCell = (props: IHostCell) => {
  const { name, image } = props;
  const avatarSrc = AVATARS[image as keyof typeof AVATARS] || AVATARS["avatar-01"];

  return (
    <div className="px-2 py-2.5 flex items-center gap-2">
      <img src={avatarSrc} alt={name} className="size-6 rounded-full object-cover shrink-0" />
      <span className="text-sm font-normal text-foreground whitespace-nowrap">{name}</span>
    </div>
  )
}

type IStatusCell = {
  status: string;
}
const StatusCell = (props: IStatusCell) => {
  const { status } = props;
  const variant = {
    ACTIVE: "default" as const,
    STAGING: "secondary" as const,
    COMPLETED: "outline" as const,
    CANCELLED: "destructive" as const,
  }[status] || ("outline" as const);

  return (
    <div className="px-2 py-2.5 flex items-center">
      <Badge variant={variant} className="capitalize py-0.5 px-2">
        {status.toLowerCase()}
      </Badge>
    </div>
  )
}
