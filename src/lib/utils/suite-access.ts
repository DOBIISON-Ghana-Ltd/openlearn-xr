/**
 * Helper utilities to check if a user has access to various application suites.
 */

export const hasAdminAccess = (roles: string[]) => {
  return roles.includes("admin");
};

export const hasEditorAccess = (roles: string[]) => {
  return roles.includes("admin") || roles.includes("editor");
};

export const hasSessionAccess = (subscriptionTier: string) => {
  return subscriptionTier !== "FREE";
};

export const getAccessibleSuites = (roles: string[], subscriptionTier: string) => {
  return {
    admin: hasAdminAccess(roles),
    editor: hasEditorAccess(roles),
    session: hasSessionAccess(subscriptionTier),
  };
};
