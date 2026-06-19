import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth, User } from "@/adapters/auth/server";
import { JSend } from "./jsend";

type AuthenticatedHandler<TParams> = (
  req: NextRequest,
  ctx: { params: Promise<TParams> },
  user: User
) => Promise<NextResponse>;

export function secureApiRoute<TParams>(handler: AuthenticatedHandler<TParams>) {
  return async (req: NextRequest, ctx: any) => {
    const res = await auth.api.getSession({
      headers: await headers(),
    });

    if (!res) {
      return JSend.error("Unauthorized", 401);
    }

    return handler(req, ctx, res.user);
  };
}