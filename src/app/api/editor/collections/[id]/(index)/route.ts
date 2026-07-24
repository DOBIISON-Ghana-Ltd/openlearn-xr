import prisma from "@/adapters/db/client";
import ZModules from "@/data/api/modules/modules.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const PATCH = secureApiRoute<{ id: string }>(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = ZModules.AdminCollectionPatchDetails.shape.body.parse(await req.json());

  await prisma.collection.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
    },
  });

  return JSend.success("Collection updated successfully");
});
