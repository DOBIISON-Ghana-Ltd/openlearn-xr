import useApi from "@/data/hooks/use-api";
import { getAccessibleSuites } from "@/lib/utils/suite-access";

export function useACL() {
  const { data: me, isLoading } = useApi.query("app:user:get:me");

  const roles = me?.role || [];
  const tier = me?.subscriptionTier || "FREE";
  const isUnlimited = me?.isUnlimited || false;

  const accessibleSuites = getAccessibleSuites(roles, tier, isUnlimited);

  return {
    user: me,
    isLoading,
    canStartSession: accessibleSuites.session,
    canAccessAdmin: accessibleSuites.admin,
    canAccessEditor: accessibleSuites.editor,
    can: (feature: "session" | "admin" | "editor") => {
      return accessibleSuites[feature] ?? false;
    },
  };
}
