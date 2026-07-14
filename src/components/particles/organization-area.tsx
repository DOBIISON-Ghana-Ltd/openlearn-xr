import useApi from "@/data/hooks/use-api";
import { ORG_LOGOS } from "@/lib/constants/avatars";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { DialogPrimitive, DialogTrigger } from "../ui/dialog";
import { NewOrganization } from "./new-organization";
import { MenuPrimitive, MenuTrigger } from "../ui/menu";
import MyOrganizations from "./my-organizations";

const createHandle = DialogPrimitive.createHandle();
const orgListHandle = MenuPrimitive.createHandle();

export default function OrganizationArea() {
  return (
    <>
      <div className="p-2">
        <div className="border bg-background rounded-md overflow-hidden space-y-2">
          <Info />
          <div className="flex items-center px-2 pb-2 gap-2">
            <DialogTrigger
              className="flex-1"
              handle={createHandle}
              render={<Button variant="outline" size="sm" />}
            >
              <PlusIcon />
              New Orgnization
            </DialogTrigger>
            <MenuTrigger
              handle={orgListHandle}
              render={<Button variant="outline" size="icon-sm" />}
            >
              <ChevronDownIcon />
            </MenuTrigger>
          </div>
        </div>
      </div>
      <NewOrganization handle={createHandle} />
      <MyOrganizations handle={orgListHandle} />
    </>
  )
};

function Info() {
  const { data: org, isLoading } = useApi.query("public:org:get:active");

  if (isLoading) {
    return <Info.Skeleton />
  }

  if (!isLoading && !org) {
    return <Info.Error />
  }

  return (
    <div className="flex gap-2 items-center px-2 pt-2">
      <img
        src={ORG_LOGOS[org.logo]}
        alt={org.name}
        className="self-start w-10 aspect-square rounded-sm object-cover"
      />
      <div className="flex flex-col">
        <p className="text-sm-m font-normal text-foreground capitalize">{org.name}</p>
        <p className="self-start font-medium text-xs text-background px-1 bg-foreground uppercase">{org.subscriptionTier}</p>
      </div>
    </div>
  )
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex gap-2 items-center px-2 pt-2">
      <Skeleton className="self-start w-10 aspect-square rounded-xs" />
      <div className="flex flex-col gap-1 mt-1">
        <Skeleton className="h-3.75 w-16" />
        <Skeleton className="self-start h-3 w-8" />
      </div>
    </div>
  )
}

Info.Error = function InfoError() {
  return (
    <div className="flex-center pt-2">
      <p className="text-xs font-medium text-muted-foreground">Something went wrong</p>
    </div>
  )
}