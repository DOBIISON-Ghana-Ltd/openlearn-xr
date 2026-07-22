import { secureApiRoute } from "@/lib/utils/secure-api-route";
import { JSend } from "@/lib/utils/jsend";
import prisma from "@/adapters/db/client";
import ZModules from "@/data/api/modules/modules.schema";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

export const GET = secureApiRoute(async (req, ctx, user) => {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          modules: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const parsedData = ZModules.PublicCollectionGetAll.shape.res.parse(collections);
  return JSend.success(parsedData);
});

export const POST = secureApiRoute(async (req, ctx, user) => {
  const rawBody = await req.json();
  const body = ZModules.PublicCollectionCreate.shape.body.parse(rawBody);

  const baseSlug = slugify(body.name);
  const uniqueSlug = `${baseSlug}-${nanoid(6)}`;

  const created = await prisma.collection.create({
    data: {
      name: body.name,
      slug: uniqueSlug,
      description: body.description || null,
    },
    select: {
      id: true,
    },
  });

  const parsedData = ZModules.PublicCollectionCreate.shape.res.parse(created);
  return JSend.success(parsedData);
});
