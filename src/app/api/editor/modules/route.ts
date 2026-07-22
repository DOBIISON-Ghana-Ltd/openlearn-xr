import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZModules from "@/data/api/modules/modules.schema";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

export const GET = secureApiRoute(async (req, ctx, user) => {
  const modules = await prisma.module.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      orderIndex: true,
      createdAt: true,
      updatedAt: true,
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZModules.PublicModuleGetAll.shape.res.parse(modules);
  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user) => {
  const rawBody = await req.json();
  const body = ZModules.PublicModuleCreate.shape.body.parse(rawBody);

  const baseSlug = slugify(body.title);
  const uniqueSlug = `${baseSlug}-${nanoid(6)}`;

  // Find current max orderIndex in this collection to append
  const lastModule = await prisma.module.findFirst({
    where: { collectionId: body.collectionId },
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  });
  const newOrderIndex = (lastModule?.orderIndex ?? -1) + 1;

  const created = await prisma.module.create({
    data: {
      title: body.title,
      slug: uniqueSlug,
      description: "",
      orderIndex: newOrderIndex,
      collectionId: body.collectionId,
    },
    select: {
      id: true,
    },
  });

  const parsedData = ZModules.PublicModuleCreate.shape.res.parse(created);
  return JSend.success(parsedData);
});
