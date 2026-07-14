export const AVATARS = {
  "avatar-01": "/avatar/avatar-01.png",
  "avatar-02": "/avatar/avatar-02.png",
  "avatar-03": "/avatar/avatar-03.png",
  "avatar-04": "/avatar/avatar-04.png",
  "avatar-05": "/avatar/avatar-05.png",
  "avatar-06": "/avatar/avatar-06.png",
  "avatar-07": "/avatar/avatar-07.png",
  "avatar-08": "/avatar/avatar-08.png",
  "avatar-09": "/avatar/avatar-09.png",
  "avatar-10": "/avatar/avatar-10.png",
} as const;

export const ORG_LOGOS = {
  "org-01": "/orgs/org-01.png",
  "org-02": "/orgs/org-02.png",
  "org-03": "/orgs/org-03.png",
  "org-04": "/orgs/org-04.png",
  "org-05": "/orgs/org-05.png",
  "org-06": "/orgs/org-06.png",
  "org-07": "/orgs/org-07.png",
  "org-08": "/orgs/org-08.png",
  "org-09": "/orgs/org-09.png",
  "org-10": "/orgs/org-10.png",
  "org-11": "/orgs/org-11.png",
} as const;

export type AvatarKey = keyof typeof AVATARS;
export const avatarKeys = Object.keys(AVATARS) as [AvatarKey, ...AvatarKey[]];

export type OrgLogoKey = keyof typeof ORG_LOGOS;
export const logoKeys = Object.keys(ORG_LOGOS) as [OrgLogoKey, ...OrgLogoKey[]];

