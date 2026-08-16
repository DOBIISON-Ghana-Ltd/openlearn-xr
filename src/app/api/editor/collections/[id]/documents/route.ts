import prisma from "@/adapters/db/client";
import ZEditor from "@/data/api/editor/editor.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

export const GET = secureApiRoute<{ id: string }>(async (req, ctx) => {
  const { id: collectionId } = await ctx.params;

  const collectionMedia = await prisma.collectionMedia.findMany({
    where: { collectionId },
    include: {
      media: {
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          key: true,
          status: true,
          folder: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const parsed =
    ZEditor.EditorCollectionGetDocuments.shape.res.parse(collectionMedia);

  return JSend.success(parsed);
});
