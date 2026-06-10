import { createAuthClient } from "better-auth/react";
import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { ac, admin as adminRole, editor, user } from './permissions'
import { env } from "@/lib/config/env";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        user,
        editor,
        admin: adminRole,
      },
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    emailOTPClient(),
  ]
})