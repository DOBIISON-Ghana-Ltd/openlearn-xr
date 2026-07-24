"use client";

import { Menu, MenuPrimitive, MenuPopup, MenuItem } from "../ui/menu";
import useApi from "@/data/hooks/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/data/key-factory";
import { match } from "ts-pattern";

export default function MyOrganizations(props: MenuPrimitive.Root.Props) {
  const { data: orgs, isLoading: isListLoading } = useApi.query("app:org:get:all");
  const { data: activeOrg } = useApi.query("app:org:get:active");
  const { mutate: setActive } = useApi.mutate("app:org:patch:active");
  const queryClient = useQueryClient();

  const handleSelectOrg = (orgId: string) => {
    setActive(
      { id: orgId },
      {
        onSuccess: () => {
          queryClient.resetQueries({
            queryKey: [...QUERY_KEYS["app:org:get:active"]],
          });
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS["app:user:get:me"]],
          });
        },
      }
    );
  };

  const status = isListLoading ? "loading" : orgs && orgs.length > 0 ? "success" : "empty";

  return (
    <Menu {...props}>
      <MenuPopup side="right" align="start">
        {match(status)
          .with("loading", () => (
            <MenuItem disabled>Loading organizations...</MenuItem>
          ))
          .with("success", () => (
            <>
              {orgs?.map((org) => (
                <MenuItem
                  key={org.id}
                  className="capitalize"
                  onClick={() => handleSelectOrg(org.id)}
                  disabled={org.id === activeOrg?.id}
                >
                  {org.name}
                </MenuItem>
              ))}
            </>
          ))
          .with("empty", () => (
            <MenuItem disabled>No organizations found</MenuItem>
          ))
          .exhaustive()
        }
      </MenuPopup>
    </Menu>
  );
}