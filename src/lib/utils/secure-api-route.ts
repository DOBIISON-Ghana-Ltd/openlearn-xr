import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth, Session, User } from "@/adapters/auth/server";
import { JSend } from "./jsend";
import { handleApiError } from "./api-handler";

type AuthenticatedHandler<TParams> = (
  req: NextRequest,
  ctx: { params: Promise<TParams> },
  user: User,
  session: Session["session"]
) => Promise<NextResponse>;

export function secureApiRoute<TParams>(handler: AuthenticatedHandler<TParams>) {
  return async (req: NextRequest, ctx: any) => {
    try {
      const res = await auth.api.getSession({
        headers: await headers(),
      });

      if (!res) {
        return JSend.error("Unauthorized", 401);
      }

      return await handler(req, ctx, res.user, res.session);
    } catch (error) {
      return handleApiError(error);
    }
  };
}