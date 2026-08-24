import prisma from "@/adapters/db/client";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";
import ZApp from "@/data/api/app/app.schema";

const ZPostBody = ZApp.AppMediaPostOne.shape.body;

export const POST = secureApiRoute(async (req, ctx, user) => {
  const body = ZPostBody.parse(await req.json());

  const res = await prisma.media.create({
    data: {
      folder: body.folder,
      key: body.key,
      fileName: body.fileName,
      mimeType: body.mimeType,
      metadata:
        body.width || body.height
          ? { width: body.width, height: body.height }
          : undefined,
      uploaderId: user.id,
    },
    select: {
      id: true,
    },
  });

  return JSend.success(res);
});
