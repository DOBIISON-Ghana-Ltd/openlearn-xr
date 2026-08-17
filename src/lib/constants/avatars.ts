export const AVATARS = {
  "avatar-01": {
    image: "/avatar/avatar-01.png",
    color: "#9956de",
  },
  "avatar-02": {
    image: "/avatar/avatar-02.png",
    color: "#7274ed",
  },
  "avatar-03": {
    image: "/avatar/avatar-03.png",
    color: "#1fa7e1",
  },
  "avatar-04": {
    image: "/avatar/avatar-04.png",
    color: "#6ed1cf",
  },
  "avatar-05": {
    image: "/avatar/avatar-05.png",
    color: "#75d06a",
  },
  "avatar-06": {
    image: "/avatar/avatar-06.png",
    color: "#ffb356",
  },
  "avatar-07": {
    image: "/avatar/avatar-07.png",
    color: "#ff8bbb",
  },
  "avatar-08": {
    image: "/avatar/avatar-08.png",
    color: "#fb96bb",
  },
  "avatar-09": {
    image: "/avatar/avatar-09.png",
    color: "#e879f9",
  },
  "avatar-10": {
    image: "/avatar/avatar-10.png",
    color: "#ffd166",
  },
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
