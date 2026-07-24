"use client";

import { useQueryClient } from "@tanstack/react-query";
import { match } from "ts-pattern";
import useApi from "@/data/hooks/use-api";
import { QUERY_KEYS } from "@/data/key-factory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, MenuPopup, MenuGroup, MenuItem, MenuTrigger, MenuPrimitive } from "@/components/ui/menu";
import { DialogTrigger, DialogPrimitive } from "@/components/ui/dialog";
import { MoreVertical, UserPlusIcon } from "lucide-react";
import { AVATARS } from "@/lib/constants/avatars";
import { cn } from "@/lib/utils/cn";
import { InviteMemberDialog } from "./invite-member-dialog";
import type { Infer } from "@/data/types.base";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type IMember = Infer["AppOrgGetMembers"]["res"][number];

const INVITE_ALLOWED_TIERS = ["DEPARTMENT", "ENTERPRISE", "UNLIMITED"];

// ---------------------------------------------------------------------------
// MemberMenu — detached menu content component
// ---------------------------------------------------------------------------
type MemberMenuProps = MenuPrimitive.Root.Props & {
  member: IMember;
  orgId: string;
  onSuccess: () => void;
};
export function MemberMenu({ member, orgId, onSuccess, ...menuProps }: MemberMenuProps) {
  const { mutate: removeUser, isPending: isRemoving } = useApi.mutate("app:org:delete:member");
  const { mutate: changeRole, isPending: isChangingRole } = useApi.mutate("app:org:patch:member-role");

  const isPending = isRemoving || isChangingRole;
  const isOwner = member.role === "owner";
  const toggleRoleLabel = isOwner ? "Assign as member" : "Assign as owner";

  const handleRemove = () => {
    removeUser(
      {
        params: { orgId },
        body: { id: member.id },
      },
      { onSuccess }
    );
  };

  const handleToggleRole = () => {
    changeRole(
      {
        params: { orgId },
        body: { id: member.id, role: isOwner ? "member" : "owner" },
      },
      { onSuccess }
    );
  };

  return (
    <Menu {...menuProps}>
      <MenuPopup className="w-48" align="end">
        <MenuGroup>
          <MenuItem onClick={handleToggleRole} disabled={isPending}>
            {toggleRoleLabel}
          </MenuItem>
          <MenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            Remove member
          </MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}

// ---------------------------------------------------------------------------
// MemberRow
// ---------------------------------------------------------------------------
type MemberRowProps = {
  member: IMember;
  isSelf: boolean;
  isCallerOwner: boolean;
  orgId: string;
  onMutationSuccess: () => void;
};
function MemberRow({ member, isSelf, isCallerOwner, orgId, onMutationSuccess }: MemberRowProps) {
  const menuHandle = MenuPrimitive.createHandle();

  const roleLabel = match(member.role)
    .with("owner", () => "Workspace Owner")
    .with("member", () => "Member")
    .exhaustive();

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        { "hover:bg-muted/20": !isSelf }
      )}
    >
      {/* Avatar */}
      <Avatar className="size-9 shrink-0">
        {member && (
          <AvatarImage
            src={AVATARS[member.user.image]}
            alt={member.user.name}
          />
        )}
      </Avatar>

      {/* Name & email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {member.user.name}
          {isSelf && (
            <span className="ml-1.5 text-xs text-muted-foreground font-normal">(you)</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
      </div>

      {/* Role label */}
      <span className="text-sm text-muted-foreground shrink-0 min-w-28 text-right pr-2">
        {roleLabel}
      </span>

      {/* Menu slot — only for non-self members when caller is owner */}
      {match({ isSelf, isCallerOwner })
        .with({ isSelf: false, isCallerOwner: true }, () => (
          <>
            <MenuTrigger
              handle={menuHandle}
              render={<Button variant="ghost" size="icon-xs" />}
            >
              <span className="sr-only">Open member actions</span>
              <MoreVertical className="size-4" />
            </MenuTrigger>
            <MemberMenu
              handle={menuHandle}
              member={member}
              orgId={orgId}
              onSuccess={onMutationSuccess}
            />
          </>
        ))
        .otherwise(() => (
          <div className="size-7 shrink-0" />
        ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileOrgMembersCenter
// ---------------------------------------------------------------------------
export function ProfileOrgMembersCenter() {
  const qc = useQueryClient();
  const inviteHandle = DialogPrimitive.createHandle();

  const { data: me } = useApi.query("app:user:get:me");
  const { data: activeOrg } = useApi.query("app:org:get:active");
  const { data: subscription } = useApi.query(
    "app:org:get:subscription",
    activeOrg?.id,
    !!activeOrg?.id
  );
  const { data: members, isLoading } = useApi.query(
    "app:org:get:members",
    activeOrg?.id,
    !!activeOrg?.id
  );

  if (isLoading) {
    return <ProfileOrgMembersCenter.Skeleton />;
  }

  const orgId = activeOrg?.id;
  const tier = activeOrg?.subscriptionTier ?? "FREE";
  const canInvite = INVITE_ALLOWED_TIERS.includes(tier) || !!me?.isUnlimited;

  const totalSeats = match(subscription)
    .with({ isUnlimited: true }, () => "∞")
    .otherwise((sub) => String(sub?.seats ?? 1));

  const memberCount = members?.length ?? 0;

  const callerMember = members?.find((m) => m.user.id === me?.id);
  const isCallerOwner = callerMember?.role === "owner";

  const invalidateMembers = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS["app:org:get:members"](orgId) });
  };

  return (
    <div className="flex flex-col w-full px-4 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-normal text-foreground">
            Members{" "}
            <span className="text-muted-foreground text-base font-normal">
              ({memberCount}/{totalSeats})
            </span>
          </h4>

          {match(canInvite)
            .with(false, () => (
              <p className="text-sm text-muted-foreground">
                Looking to collaborate with more people?{" "}
                <Link href="/licensing" className="text-primary hover:underline">
                  Choose your plan
                </Link>
              </p>
            ))
            .with(true, () => (
              <p className="text-sm text-muted-foreground">
                Manage your organization&apos;s members and roles.
              </p>
            ))
            .exhaustive()}
        </div>

        {/* Invite button — only visible to owners */}
        {isCallerOwner && (
          <div>
            <DialogTrigger
              handle={inviteHandle}
              disabled={!canInvite}
              render={<Button size="sm" variant="outline" id="invite-members-btn" />}
            >
              <UserPlusIcon className="size-4 mr-1.5" />
              Invite members
            </DialogTrigger>
            <InviteMemberDialog handle={inviteHandle} />
          </div>
        )}
      </div>

      {/* Members list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {match((members?.length ?? 0) > 0)
          .with(false, () => (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          ))
          .with(true, () => (
            <div className="flex flex-col divide-y divide-border/50">
              {members!.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isSelf={member.user.id === me?.id}
                  isCallerOwner={isCallerOwner ?? false}
                  orgId={orgId!}
                  onMutationSuccess={invalidateMembers}
                />
              ))}
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static Skeleton Loader
// ---------------------------------------------------------------------------
ProfileOrgMembersCenter.Skeleton = function ProfileOrgMembersCenterSkeleton() {
  return (
    <div className="flex flex-col w-full px-4 py-6 space-y-6 pb-12">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36 rounded-xs" />
          <Skeleton className="h-4 w-64 rounded-xs" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xs" />
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/50">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="size-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32 rounded-xs" />
              <Skeleton className="h-3 w-48 rounded-xs" />
            </div>
            <Skeleton className="h-3.5 w-24 rounded-xs shrink-0" />
            <div className="size-7 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};